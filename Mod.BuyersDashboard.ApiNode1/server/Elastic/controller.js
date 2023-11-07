const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chalk = require('chalk');
const { Client } = require('@elastic/elasticsearch');
const logger = require('../Helpers/logger');
const SearchRequest = require('../Models/searchRequest');
const Settings = require("../Config/settings");
const InternalSettings = require("../Config/internalSettings");
const Helper = require("./helper");
const { json } = require("express");
const querystring = require('querystring');
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");
const comparisons = require("assert/build/internal/util/comparisons");
const  _  =  require('lodash');

class Controller {
  

  helper = new Helper();
  client = new Client({
    node: InternalSettings.elasticUrl,
    requestTimeout:300000
  });


  test = () => {
    return 'Jim';
  };

  async indices() {
    const doc = await this.client.cat.indices({ v: true });
    logger.info(doc.body);

  };

  async getAllAggregations() {

    let results = [];
     const settings = Settings.general;
     const indicesWithAggregations = Settings.general.filter(i => i.aggregation != null);
     const relevantIndices = indicesWithAggregations.map(i=>i.name);
        
    const data = await this.client.search({
          index: relevantIndices,
          size: 0,
          body: {
            "aggs": JSON.parse(this.helper.getAllAggregations(indicesWithAggregations))
          }
        });
        console.log(`all aggregations is ===>  `+ data.meta.request.params.body);
         //console.log(JSON.stringify(data, null, 4));
          // var aggregations = Settings.general.filter(x => x.name == index)[0].aggregation;
          let indexAggs = [];
          let aggsOfField = []
          const aggs = { ...data.body.aggregations };
         
          relevantIndices.forEach(ri => {

            for (let [key, value] of Object.entries(aggs)) {
              
               let index= key.split('____')[0];
               let field= key.split('____')[1];
               let aggsItems=[];
               if(ri === index)
               {  
                aggsItems = value.buckets.map(b => b.key);
                //  const specialsAggs = (settings.filter(a=>a.name==="friends")[0]).aggregation.filter(b=>b.split("|").length > 1);
                //  if(ri === "friends")   
                //  {
                //     debugger;
                //  }
                //  else
                //  {
                //      aggsItems = value.buckets.map(b => b.key);  
                //  }
                 if(aggsItems.length > 0)        
                      aggsOfField.push({ field : field, list: aggsItems });                
               }
                             
              }

              if(indexAggs.findIndex(i=>i.index ===  ri) > -1)
                {
                  indexAggs[indexAggs.findIndex(i=>i.index ===  ri)].aggs.push(aggsOfField);
                }
                else
                {                 
                  indexAggs.push({index:ri,aggs:aggsOfField});
                }
                aggsOfField=[];
          });                  
          //results.push({ index, 'allAggs': indexAggs }); 
          return indexAggs;
              
       // .catch(e =>{
          
      //    console.error(chalk.white.bgRed.bold(e));
      //   logger.info(e);
    //});           
   
   
    // console.log(JSON.stringify(results));
    // return results;
  }


  // async searchNonActives(req) {

  //   //const activeIndex = req.body.activeIndex || 'orders';
  //   const nonActives = Settings.general;
  //   const term = req.query.term; 
  //   let results = [];

  //   const roleIds = req.headers['roleids'];

  //   const res = await this.client.msearch({
  //     body: this.helper.getMultiSearchQuery(nonActives, term,roleIds)
  //   })
  //     .then(data => {
  //       console.log(chalk.white.bgBlue.bold(" success searchNonActives"));
        
  //       return data;
  //     })
  //     .catch(err => {
  //       console.log(chalk.white.bgRed.bold(err));
  //       logger.info(err);
  //     });

  //   console.log(chalk.white.green.bold(res.meta.request.params.body));

  //   nonActives.forEach((element, index) => {
  //     results.push({ name: element.name, count: res.body.responses[index].hits.total.value | 0 });
  //     // post _msearch  ...reasttake from console
  //    // console.log(results);
  //   });
  //   return results;
  // }

  async searchAsync(req) {
    try {
      const roleIds = req.headers['roleids'];

      const activeIndex = req.body.activeIndex;
      const indexSettings = Settings.general.find(x => x.name === activeIndex);
  
      const searchRequest = new SearchRequest();
      searchRequest.activeIndex = activeIndex;
      searchRequest.term = req.body.term;
      searchRequest.page = req.body.page;
      searchRequest.size = req.body.size;
      searchRequest.andCondition = 'or';
      searchRequest.sortDirection = 'desc';
      searchRequest.sort = '_id';
      searchRequest.selectedAggregations =req.body.selectedAggregations == null ? [] :req.body.selectedAggregations ;
      searchRequest.specialAggregations =req.body.specialAggregations == null ? [] :req.body.specialAggregations ;
      searchRequest.includecounters = req.body.includecounters;

      searchRequest.term = _.trim( searchRequest.term);
      if( searchRequest.term.startsWith('"') && searchRequest.term.endsWith('"'))
      {
        searchRequest.term = searchRequest.term.replace(/"/g, '')
        searchRequest.andCondition = 'and';
      }


      // searchRequest.filters = [{ "key": "status", "values": ["processed", "completed", "cancelled"] },
      // { "key": "sales_channel", "values": ["store", "web", "phone"] }];
      
     var mustArrays = this.helper.appenedRoles(searchRequest,roleIds).
                      concat(this.helper.appenedAggs(searchRequest)).
                      concat(this.helper.appenedSpecialAggregations(searchRequest));
     
      const doc = await this.client.search({
        index: searchRequest.activeIndex,
        _source: false,

        //sort: [searchRequest.sort + ':' + searchRequest.sortDirection],
        body: {
          fields: indexSettings.returnFields, //return fields  
          size: searchRequest.size,        
          //sort: this.helper.getSorting(searchRequest),
          from: searchRequest.size * searchRequest.page,
          highlight: {
            //pre_tags: ["<span className={classes.highlighter}>"],
            //post_tags: ["</span>"],
             pre_tags: ["<em>"],
            post_tags: ["</em>"],
            fields: {
              "*": { "fragment_size": 100, "number_of_fragments": 5  }
            }
          },
          aggs: this.helper.getAggsStr(indexSettings.aggregation),
          query: {
            bool: {     
              minimum_should_match: 1        ,
              should: this.helper.getQuery(searchRequest, indexSettings.searchFields),
              must:mustArrays,
              
            }
          }

        }
      })
      .then(data=>{   
        //logger.info(data.meta.request.params.body);
        logger.info("***********");
        //console.log(data.meta.request.params.path);
        console.log(data.meta.request.params.body);
        //logger.info(data);
        return data;
      })
      .catch(e=>{
        logger.error(e.meta.meta.request.params.path + "***************" + e.meta.meta.request.params.body);
        console.error(chalk.white.bgRed.bold(e.meta.meta.request.params.path + "***************" + e.meta.meta.request.params.body));        
      });

     //////////////non active
      const nonActiveIndices = Settings.general.filter(x =>x.name !== activeIndex);  ;     
      let counters = [];  
      counters.push({ name: searchRequest.activeIndex, count: doc.body.hits.total.value | 0 });

      let res = null;

//       post _msearch
// {"index":"orders"}
// {"query":{"multi_match":{"fields":["sales_channel^5","salesman.name","status","_id"],"query":"web","lenient":true,"fuzziness":"AUTO","operator":"or"}},"size":0}

      if(nonActiveIndices.length > 0)     
      {
         res = await this.client.msearch({
          body: this.helper.getMultiSearchQuery(nonActiveIndices, searchRequest.term,roleIds)
        })
          .then(data => {
            console.log(chalk.white.bgBlue.bold(" success counters"));   
            console.log(chalk.white.green.bold(data.meta.request.params.body));       
            return data;
          })
          .catch(err => {
            console.log(chalk.white.bgRed.bold(err));
            logger.info(err);
          });       
    
          nonActiveIndices.forEach((element, index) => {
            counters.push({ name: element.name, count: res.body.responses[index].hits.total.value | 0 });
        });
     }
    
    
    
    

    return {hits: doc.body.hits.hits,aggregations:doc.body.aggregations,counters};

      
     
    }
    catch (err) {
      
      logger.error(err.message);
      console.log(chalk.white.bgRed.bold(err.message));
      //console.log(err);
      return err;
    }
  };

  async excelAsync(req) {
    try {
      const roleIds = req.headers['roleids'];
      const activeIndex = req.body.activeIndex;
      const indexSettings = Settings.general.find(x => x.name === activeIndex);

      const searchRequest = new SearchRequest();
      searchRequest.activeIndex = activeIndex;
      searchRequest.term = req.body.term;
      searchRequest.page = 0;
      searchRequest.size = req.body.size;
      searchRequest.andCondition = 'or';
      searchRequest.sortDirection = 'desc';
      searchRequest.sort = '_id';
      searchRequest.selectedAggregations =req.body.selectedAggregations == null ? [] :req.body.selectedAggregations ;
      searchRequest.specialAggregations =req.body.specialAggregations == null ? [] :req.body.specialAggregations ;

      searchRequest.term = _.trim( searchRequest.term);
      if( searchRequest.term.startsWith('"') && searchRequest.term.endsWith('"'))
      {
        searchRequest.term = searchRequest.term.replace(/"/g, '')
        searchRequest.andCondition = 'and';
      }

      var mustArrays = this.helper.appenedRoles(searchRequest,roleIds).
      concat(this.helper.appenedAggs(searchRequest)).
      concat(this.helper.appenedSpecialAggregations(searchRequest));

      const doc = await this.client.search({
        index: searchRequest.activeIndex,
        _source: false,

        //sort: [searchRequest.sort + ':' + searchRequest.sortDirection],
        body: {
          fields: indexSettings.returnFields, //return fields  
          size: searchRequest.size,
         // sort: this.helper.getSorting(searchRequest),
          from: searchRequest.size * searchRequest.page,
         
          aggs: this.helper.getAggsStr(indexSettings.aggregation),
          query: {
            bool: {  
              minimum_should_match: 1 ,           
              should: this.helper.getQuery(searchRequest, indexSettings.searchFields),
              must:mustArrays
            }
          }
      }
      });
      this.helper.logging(doc);
      return {results: doc.body.hits.hits};
    }
    catch (err) {
      
      logger.error(err.message);
      //console.log(err);
      return err;
    }
  };

  //post   /orders%2Ccompanies%2Cbooks%2Crestaurant%2Cproducts%2Ctodos%2Cyoutubes%2Cemployees%2Ccomments%2Cfriends/_search?_source=false&size=20   + body from console
  async autocompleteAsync(req) {
    try {
      
      let term = req.query.term;     
      const roleIds = req.headers['roleids'] ?? [];
      let doc;
            
      //imp with roleIds
      if(roleIds != 'null' && roleIds.length > 0 && Settings.general.some(x => x.rolesRequired)){
      doc = await this.client.search({
        index: Settings.general.map(a => a.name).join(','),
        _source: false,
        size: 10,
        body: {
          fields: ["autocomplete"],
          query : {                 
                    bool: {                      
                      must:[
                      JSON.parse(`{"terms":{"SectionId":["${roleIds.split(',').join('","')}"]}}`),
                      {multi_match:{
                        query: term,                       
                        fields: [
                          "autocomplete"
                        ]
                      }
                    }
                    ],
                } }}
      });
    }
    else  if(Settings.general.filter(x => x.rolesRequired).length === 0) //withut roles
    {
      doc = await this.client.search({
        index: Settings.general.map(a => a.name).join(','),
        _source: false,
        size: 20,
        body: {
          fields: ["autocomplete"],
          _source:false,
          query: {
            multi_match: {
              query: term,             
              fields: [
                "autocomplete"               
              ]
            }
          }
        }
      });
    }



    
      console.log(doc.meta.request.params["path"] +'?'+ doc.meta.request.params["querystring"]);
      console.log( doc.meta.request.params.path );
      console.log(doc.meta.request.params.body);
       let arr  = doc.body.hits.hits.map(h => h).map(m => m.fields).map(a => a.autocomplete[0].replace(/\[/g, '').replace(/\]/g, '').replace(/\=/g, ''));
      return  [...new Set( arr)]      
    }
    catch (err) {
      logger.error(err.message);
      //console.log(err);
      return err;
    }
  };

  old = (req, res) => {
    res.header('Content-Type', 'application/json');
    this.client.search({
      index: 'clients',
      type: '_doc',
      q: '*'
    }, function (error, response) {
      if (error) {
        console.log('in error')
        res.status(200).send(error);
      } else {

        let results = response.body.hits.hits[0]._source.clients;

        res.status(200).send(results);

      }
    });
  }

  insertSingles(index, rows) {
    let count = 0;
    rows.forEach(r => {
      this.client.index({
        index: index,
        body: r
      })
        .then(data => { console.log(count++); })
        .catch(err => 
          console.log(err));
          throw err;
    });
 
    return rows.length + ' inserted - ok';
  }

  async loadBulk(index,rows,entityId){
    console.log(`load req index ${index}`);
  const body = rows.flatMap(doc => [{ index: { _index: index, _id: doc.EntityId} }, doc]);
  //console.log(`load req for ${index} - id is ${entityId}`);
  const { body: bulkResponse } = await this.client.bulk({ refresh: true, body })

  if (bulkResponse.errors) {
    console.log(chalk.white.bgRed.bold(entityId + "error " + bulkResponse.errors));
    logger.error(entityId + "- error " + bulkResponse.errors);
    const erroredDocuments = []
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1]
        })
      }
    })    
    console.log(erroredDocuments)  ;
    throw new error(); 
  }
  }

}
module.exports = Controller;



