const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chalk = require('chalk');
const { Client } = require('@elastic/elasticsearch');
const logger = require('../Helpers/logger');
const SearchRequest = require('../Models/searchRequest');
const Settings = require("../Config/settings");
const InternalSettings = require("../Config/internalSettings");

class Helper {
     dror = "dror mushay" ;
     uri =   "http://localhost:9200";
     indexes = ['clients'];

     client = new Client({
        node: this.uri,
        requestTimeout:300000
      });
     
    
    
    getSorting(searchRequest)
    {      
      let str = `[{"${searchRequest.sort}":{"order":"${searchRequest.sortDirection}"}}]`;
     // "sort":[{"lines.amount":{"order":"desc"}}]}
      return JSON.parse(str);      
    }
  
    

   

    getFiledsWithMelingo(indexFields)
    {
           
            return indexFields.filter(a=>a.indexOf('.melingo')> 0 );         
          //return indexFields;
      }
    appenedRoles(searchRequest,roleIds)
    {
      var arr = []; 
      const indexSettings = Settings.general.find(x => x.name === searchRequest.activeIndex);
        // roleIds checing - in mafat is section
        if(indexSettings.rolesRequired)
        { 
            if(roleIds.split(',').length === 1)
            {
              arr.push(JSON.parse(`{"term":{"SectionId":"${roleIds}"}}`));
            }
            else if (roleIds.split(',').length > 1)
            {
              arr.push(JSON.parse(`{"terms":{"SectionId":["${roleIds.split(',').join('","')}"]}}`));
            }
        }
        return arr;
    }
    appenedSpecialAggregations(searchRequest)
    {
      var arr = []; 
        if(searchRequest.specialAggregations.length == 0) {return arr ;}

        searchRequest.specialAggregations.forEach(special => {
         
          console.log(chalk.white.green.bold(JSON.stringify(special)));
          let strJson = null;

            switch(special.type){
              case 'number':
                 strJson  = `{"range":
                {
                  "${special.field}":
                  {
                    ${special.from ? '"gte":'+ special.from    : '' }
                    ${special.from &&special.to  ? "," : '' }
                    ${special.to ?  '"lte":'+ special.to  : ''  }                                            
                }}}`;
               break;
              case 'datetime-local':
              case 'date ':
                 strJson  = `{"range":
                {
                  "${special.field}":
                  {
                    ${special.from ? '"gte":"'+ special.from   +'"' : '' }
                    ${special.from &&special.to  ? "," : '' }
                    ${special.to ?  '"lte":"'+ special.to +'"' : ''  }                                            
                }}}`;
                
                break;
              default:
                break;
            }
            if(strJson != null)
                arr.push(JSON.parse(strJson));
                    
        });
        return arr;

    }
    appenedAggs(searchRequest)
    {
      var arr = []; 
      let activeAggsFileds = [];

      const indexSettings = Settings.general.find(x => x.name === searchRequest.activeIndex);
     
      searchRequest.selectedAggregations.forEach(selected => { 
        let field = selected.split("___")[0];
        if(!activeAggsFileds.includes(field))
        {
          activeAggsFileds.push(field);
        }
      });
      
      activeAggsFileds.forEach(field => {

        let aggsOfField = searchRequest.selectedAggregations.filter (a=>{if (a.includes(field +"___")) return a;});
        aggsOfField = unescape(aggsOfField);
       // aggsOfField = aggsOfField.map(a=>a.replace('"','\\"'));
       aggsOfField = aggsOfField.replace(/"/g,'\\"');
       aggsOfField = aggsOfField.split(',');
      

        if(aggsOfField &&  aggsOfField.length == 1 )
        {                   
          arr.push(JSON.parse(`{"term":{"${field}${this.getAggType('.keyword')}":"${aggsOfField[0].split("___")[1]}"}}`));
        }
        else if(aggsOfField &&aggsOfField.length > 1 )
        {                    
          let cleanValues = aggsOfField.map(f=>f.split("___")[1]);
          arr.push(JSON.parse(`{"terms":{"${field}${this.getAggType('.keyword')}":["${cleanValues.join('","')}"]}}`));
        }

      });

      return arr;    
    }
    getQuery(searchRequest,indexFields,roleIds)
    {
     
     
      //we need to prpare the filter seactions like  ,sample:  note term and terms !!!!

      // "must":[
      //   { "terms" : { "status":["processed","completed"] } },
      //   { "term" : { "sales_channel": "web" } },
      //   {"multi_match":
      //        {
      //       "fields":["sales_channel^5","salesman.name","status","_id"],
      //        "query":"store online web","operator":"or"
      //        }
      //   }


      //find , which fields contains any aggs
     
      const indexSettings = Settings.general.find(x => x.name === searchRequest.activeIndex);

      var  arr = []; 
      console.log('term is ' +searchRequest.term );

      // if(searchRequest.andCondition != 'or')//and - exact
      // {
        arr.push({
        multi_match:{
          boost : 4,
          fields: indexFields.join().replace(/.melingo/g, '').split(',') ,//search fields 
          query:  searchRequest.term,
          lenient: true,
          fuzziness:  '0',
          operator:   'and'
          }});
      //}
      //melingo
      if(searchRequest.andCondition == 'or')
      {
        arr.push({
          multi_match:{
            boost : 0.1,
            fields: indexFields.join().replace(/.melingo/g, '').split(',') ,//search fields 
            query:  searchRequest.term,
            lenient: true,
            fuzziness:  'auto',
            operator:   searchRequest.term.split(' ').length<2 ? 'and' : 'or' //for term like 11-22222222
            }});

        arr.push({
          multi_match:{
            boost :1,
            fields:  this.getFiledsWithMelingo(indexFields,true),//search fields 
            query:  this.getMelingoQuery(searchRequest.term) ,
            lenient: true,
            fuzziness:'0',
           operator: searchRequest.term.split(' ').length<2 ? 'and' : 'or' //for term like 11-22222222,
          //operator:   searchRequest.andCondition
      //  operator: searchRequest.term.split(' ').length > 1 ? 'and' :"or",
          }});          
      }
      return arr;
    } 

    
 
    getMelingoQuery(term)
    {
       
        const terms= term.trim(' ').split(' ').filter(a=>a != '');

        if(terms.length == 1)
        {
          return  InternalSettings.melingoPrefix.trim() +  term.trim();
        }
        else{
   
          return (terms.map(t=>  (InternalSettings.melingoPrefix +  t +" ").trim() ) ).toString().replace(',',' ');
        }

    }

     getAggType(f)
     {
       let  aggsType='';
       switch("keyword")        
       {
         case "keyword":
           aggsType='.keyword';
           break;
 
        //  case "number":
        //  case "datetime":
        default:  
            aggsType='';
           break;
       }
       return aggsType;
     }
 
     getAggSize(agg)
     {
       return 101;
     }
    getAggsStr(filters)
    {
      let str='';
      if(filters == null || filters.length==0)
        return;
        
      filters.forEach(f => {
        let isKeyword  = true;                             
         str += `"by_${f}":{"terms":{"field":"${f}${this.getAggType(f)}","size":${this.getAggSize(f)}}},`;
       })
       //str += this.getTotalAmountRangeAggregation();
       //str += this.getPurchasedAtRangeAggregation();

       str = str.slice(0,-1);
       return JSON.parse(`{${str}}`);
       
      
    }
  //   getPurchasedAtRangeAggregation()
  //   {
  //     return `"by_purchased_at": {
  //       "range": {
  //       "field": "purchased_at",
       
  //       "format": "MM-yyyy",
  //       "ranges": [
  //         { "to": "now-10M/M" },
  //         { "from": "now-10M/M" }
  //       ]
  //     }
  //   },`;
  //  }


   getAllAggregations(indicesWithAggregations)
   {    
      let arr=[];    
      let str='';
  
      for(let i=0; i < indicesWithAggregations.length ; i++)
      {     
        for(let a=0; a < indicesWithAggregations[i].aggregation.length ; a++)
       {       
        const field = indicesWithAggregations[i].aggregation[a];
        
        str +=  `
        "${indicesWithAggregations[i].name}____${field}" : {
          "terms": { 
            "field": "${field}.keyword" ,
            "size": 1000        
          }
          },`       
      }
        
      }
     
      str = str.slice(0,-1);
      str= `{ ${str} }`;
      //console.log(chalk.white.bgRed.bold(str));
      return str;
   }
  

 



getMultiSearchQuery(nonActicesIndices,term,roleIds)
{
  let arr=[];
  
  nonActicesIndices.forEach(element => {
    
    const indexSettings =  Settings.general.find(x => x.name === element.name);  
    arr.push({ index: element.name });

    if(indexSettings.rolesRequired )
    {
    arr.push({query : {
           
              bool: {
                
                must:[
                JSON.parse(`{"terms":{"SectionId":["${roleIds.split(',').join('","')}"]}}`),
                {multi_match:{
                  fields:indexSettings.searchFields,
                  query:term,
                  lenient:true,
                  fuzziness:'1',
                  operator:'or'
                }
              }
              ],
          } },size:0});          
  }
  else
  {
    arr.push({query : {                       
      multi_match:{
        fields:indexSettings.searchFields,
        query:term,
        lenient:true,
        fuzziness:'1',
        operator:'or'
      }
  },size:0});
  }
  });
  return arr;
}


     

logging(doc)  
  {     
    //logger.info("*** querry ***");
   //logger.info( doc.meta.request.params.body)
   
    //console.log(chalk.white.blue.bold(doc.meta.request.params.body));    
    logger.info("*** results ***");
    logger.info(doc.body);
  }   
}


// getTotalAmountRangeAggregation()
// {
//       return `"by_total_amount": {
//         "range": {
//         "field": "total_amount",
//         "ranges": [
//           { "to": 100.0 },
//           { "from": 100.0, "to": 200.0 },
//           { "from": 200.0 }
//         ]
//       }
//     },`;
// }
    

module.exports = Helper;



