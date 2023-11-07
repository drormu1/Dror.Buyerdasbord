const express = require("express");
const chalk = require('chalk');
const url = require('url');
const app = express();
const os = require('os');
const bodyParser = require("body-parser");
const assert = require('assert');
const cors = require('cors');
const Controller = require("./Elastic/controller");
const Settings = require("./Config/settings");
const Load = require("./Loaders/load");
const csv = require('csv-parser');
//const sql = require('mssql/msnodesqlv8');
const { Parser } = require('json2csv');
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");
const InternalSettings = require("./Config/internalSettings");
const controller = new Controller()
const logger = require('./Helpers/logger');

//app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true }));
app.use(express.static("public"));

app.set('trust proxy','loopback');

app.get('/api/test', (req, res) => {
    
   res.status(200).send("success");
 }); 
app.get('/', (req, res) => {
   const results = controller.search();   
    res.status(200).send(controller.test());
  });






var config = {
  connectionString: 'Driver=SQL Server;Server=localhost;Database=AdventureWorks2019;Trusted_Connection=true;'
};





  // //NTLM START 
  
  // var ntlm = require('express-ntlm');
  // app.use(ntlm({
  //     debug: function() {
  //         var args = Array.prototype.slice.apply(arguments);
  //         console.log.apply(null, args);
  //     },
  //     domain: 'mod.int',
  //     //domaincontroller: 'ldap://myad.example',
  //     // use different port (default: 389)
  //     // domaincontroller: 'ldap://myad.example:3899',
  // }));
  
  // app.all('*', function(request, response) {
  //     response.end(JSON.stringify(request.ntlm)); // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
  // });
  
   
  
  // //// NTLM END

  app.get('/api/init', (req, res, next) => {  
    console.log('init start')             ;
     var query= url.parse(req.url,true).query;
     var token =  req.query.appToken == null ? req.headers['apptoken'] :req.query.appToken;
     if(InternalSettings.appToken !== "" && InternalSettings.appToken !== token)
     {
       return res.status(401).send("unauthorized");
     }
     logger.info(JSON.stringify(req.headers));
    // var userName = os.userInfo().username ;
     const userName  = req.headers['x-iisnode-auth_user']?.replace('_P','').replace('MOD.INT\\','');
   
     var user = {loginName:userName , displayName:"A" };
     
     //var loginId = path.join("domainName",user.loginName);
    
    
    
     controller.getAllAggregations()
     .then(data=> {   
      
       indices = data.map(a=>a.index);
       res.status(200).send({user,indices,specialAggregations : Settings.specialAggregations, indicesInfo:Settings.general, allAggregations:data});
     });
     
 });
 
  app.post('/api/search', (req, res, next) => {  
   
    res.header('Content-Type', 'application/json');
    controller.searchAsync(req)
      .then((r)=>{          
       console.log(chalk.white.bgBlue.bold(`success search ${req.body.activeIndex}  , found ${r.hits.length }  results`));
        res.status(200).send(r);        
      })
      .catch((e)=>{ 

        console.log(chalk.white.bgRed(e)); 
       // console.error('search: ', e)
        res.status(500).send(e.body)
      })
  });

  


  app.post("/api/excel", function (req, res,next) {

    
    // const json2csvParser = new Parser();
    //  const csv = json2csvParser.parse(myCars);
    controller.excelAsync(req)
    .then((r)=>{     
    

    // res.set('Accept', 'application/octet-stream');
    
   //  res.status(200).send(JSON.stringify(r.map(a=>a.field));
   
     res.status(200).send(r.results.map(a=>a.fields));
    
    })
    .catch((e)=>{ 
      console.log(chalk.white.bgRed(e)); 
     // console.error('search: ', e)
      res.status(500).send(e.body)
    })
    
   
  }); 
 
 

  app.get('/api/autocomplete', (req, res, next) => {     
    res.header('Content-Type', 'application/json');
    
    controller.autocompleteAsync(req)
      .then((r)=>{
        console.log('autocompleteAsync ' + r);
        res.status(200).send(r);        
      })
      .catch((e)=>{ 
        console.log(e); 
        console.error('search: ', e)
      
        res.status(500).send(e.body)
      })
  });

  app.get('/api/indices', (req, res, next) => {  

    res.header('Content-Type', 'application/json');
    controller.indices()
      .then((r)=>{
       // console.log(r);
        res.status(200).send(r);        
      })
      .catch((e)=>{ 
        console.log(e); 
       // console.error('search: ', e)
        res.status(500).send(e.body)
      })
  });
 
app.listen(InternalSettings.listeningPort, () => {
    console.log(`Example app listening at http://localhost:${InternalSettings.listeningPort}`);
  });
 



 //http://localhost:3000/load?file=todos
 //http://localhost:3000/load?file=youtubes
 //http://localhost:3000/load?file=employees
 //http://localhost:3000/load?file=comments
 //companies

 
 //city_inspections
 //books
 
//restaurant

// app.get("/readSql",function(req,res){ 
//     const tableSource= 'select * from [AdventureWorks2019].[Person].[Person]';
//     const index = 'persons';
   
//     const pool = new sql.ConnectionPool({      
//       database: 'AdventureWorks2019',
//       server: 'localhost',
//       driver: 'msnodesqlv8',
//       options: {
//         trustedConnection: true
//       }
//     })

//     pool.connect()
//     .then(() => {
//       //simple query
//       pool.request().query(tableSource, (err, result) => {        
//             //console.dir(result)
//             var rows = result.recordsets[0];
    
//             load = new Load();
    
//             let res = load.insertFromSQL(index,rows);
//             res.status(200).send({res,rows});
//         })
//     })
//     .catch((err)=>{ 
//       console.log(chalk.red(err)); 
//     // console.error('search: ', e)
//       res.status(500).send(err.body)
//     }) 

// });

  

app.get("/api/load",function(req,res){ 
  load = new Load();
  let result=null;
  try
  {
    result = load.insert(req);
  }
  catch(e)
  {
    res.status(500).send(e);
  }  
  res.status(200).send(result);   
});


app.post("/api/loadBulk",function(req,res){ 
  load = new Load();
  let result=null;
  try
  {
    result = load.loadBulk(req);
  }
  catch(e)
  {
    res.status(500).send(e);
  }  
  res.status(200).send(result);   
});



  const myCars = [
    {
      "car": "Audi",
      "price": 40000,
      "color": "blue"
    }, {
      "car": "BMW",
      "price": 35000,
      "color": "black"
    }, {
      "car": "Porsche",
      "price": 60000,
      "color": "green"
    }
  ];