import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import React, {useRef,useState, useContext, useEffect } from 'react';
import useApi from '../../api/useApi';
import config from '../../config';
import logoExcel from '../../images/excel.png'; // with import
import graph from '../../images/graph.png'; // with import
import SearchContext from '../../state/context';
import {CSVLink} from "react-csv";
import GraphList from './GraphList';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactToPrint from 'react-to-print';
import '../../css/pager.css';
import useStateWithCallback from '../../hooks/useStateWithCallback';
import { ContactSupportOutlined } from '@material-ui/icons';





export default function Pager() {
  
  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  const {search,excel,fetchSearch} = useApi(); 
  const [csvData, setCsvData] = useStateWithCallback([]);
  const csvInstance = useRef();
  const ui = state.configuration && state.configuration.indicesInfo.some(i=>i.name === state.activeIndex)
     ?  state.configuration.indicesInfo.filter(i=>i.name === state.activeIndex)[0].ui 
     : null;
  
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('body');
  const componentRef = useRef();
     
  const handleChangePage = (event, newPage) => {
    dispatch({type:'SET_PAGE_CHAGED', payload:newPage}); 
       
    //  fetchSearch().then(res=> {             
    // });
  };

  const  handleChangeRowsPerPage = (event) => {  
    dispatch({type:'SET_PAGE_SIZE_CHAGED', payload:event.target.value});                  
  };


 

const getPageSizes = () => {return [config.pageSize, config.pageSize*2,config.pageSize*5]};

  
useEffect(() => {
  //console.log('useeffect - pager');
  fetchSearch().then(res=> {             
  })},

   [state.pageNumber,state.size]
)




  function translateField(field)
  {
      if(ui)
      {           
          return ui.some(f=>f.key === field) ?  ui.find(f=>f.key === field).title : field;
      }
  }

const fetchExcel = async () => {     
  return excel(state.term, state).then(res => { 

   const parsedJson = res.data;
    if (!Array.isArray(parsedJson) ||!parsedJson.every((p) => typeof p === "object" && p !== null)) {
      return null;
    }
    let arrCsv = [];
    
    //const heading =Object.keys(parsedJson[0]).map(a=>translateField(a));
   
  
    const headings = ui.filter(f=>!f.isMultiline).map(a=>a.title);
    const keys = ui.filter(f=>!f.isMultiline).map(a=>a.key);  
    arrCsv.push(headings);
    
    //let values = parsedJson.map((j) => Object.values(j));
    let values = [];
    //let body = parsedJson.map((j) => Object.values(j).join(","));
    
    for(let rowNumber=0;rowNumber<parsedJson.length;rowNumber++)
    {
      let line=[];
      let rowData = parsedJson[rowNumber];
      console.log(rowData);
      for(let i=0;i<keys.length;i++)
      {            
        let cell = rowData[keys[i]] != null ?  rowData[keys[i]][0]: "";        
        line.push(cell);
      }
      arrCsv.push(line);
    }
    // values.forEach(v => {     
    //   arrCsv.push(v.map(a=>a.join("")));
    // });
   
    setCsvData(arrCsv,(newValue)=>{
      console.log("setCsvData",newValue,csvData);
      csvInstance.current.link.click();
    });


   
  })
};


const downloadExcel= (e) =>{
  e.preventDefault();
  fetchExcel();
}


const showGraph = (scrollType) => () => {
  setOpen(true);
  setScroll(scrollType);
};

const handleClose = () => {
  setOpen(false);
};



const descriptionElementRef = React.useRef(null);
React.useEffect(() => {
  if (open) {
    const { current: descriptionElement } = descriptionElementRef;
    if (descriptionElement !== null) {
      descriptionElement.focus();
    }
  }
}, [open]);

function getGraphsTitle()
{
  let title = '';
  if(state.configuration &&  state.configuration.indicesInfo.some(a=>a.name === state.activeIndex))
  {
       title = state.configuration.indicesInfo.filter(a=>a.name === state.activeIndex)[0].title;
  }
  const date = new Date();
  
   return `${date.toISOString().split('T')[0] + ' '+  date.toTimeString().split(' ')[0] }   דו"ח - ${title} נכון לתאריך `;

   
}

  return (
    <div  style={{display:'flex'}}>   
    
    
      <Dialog  ref={componentRef}
        fullWidth
        maxWidth="md" 
        direction="ltr"
       
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
      <DialogTitle style={{direction:'ltr',background: 'rgba(63,81,181,0.2)'}} id="scroll-dialog-title">{getGraphsTitle()}</DialogTitle>
      
      <DialogContent dividers={true}  style={{minHeight:'600px'}}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >    </DialogContentText>      
            <GraphList></GraphList>
        
      </DialogContent>
      <DialogActions className={"no-print"}>       
        
        
        <ReactToPrint
        trigger={() => 
            <Button variant="contained"  color="primary">
            הדפס
          </Button>}
        content={() => componentRef.current}
      />
        &nbsp;  
        <Button variant="contained" onClick={handleClose}  >
          סגור
        </Button> 
      </DialogActions>
    </Dialog>

      <CSVLink
                        data={csvData}
                        separtoe={","}
                        filename="data.csv"
                        className="hidden"
                        ref={csvInstance}
                        target="_blank"/>


                


    {state.results && state.results.counters.find(x=>x.name === state.activeIndex).count >  state.size ?
    // <Pagination  className={classes.pagination} count={10} color="primary" ></Pagination>

    <TablePagination  className={classes.root} style={{ }}
    rowsPerPageOptions={getPageSizes()}
    //rowsPerPageOptions={[50, 100, 500]}
    component="div"
    count={state.results.counters.find(x=>x.name === state.activeIndex).count}
    page={state.pageNumber}
    onPageChange={handleChangePage}
    rowsPerPage={state.size}
    onRowsPerPageChange={handleChangeRowsPerPage}
    labelRowsPerPage={"בדף"}
    backIconButtonText = "הצג הפריטים הקודמים"
    nextIconButtonText ="הצג הפריטים הבאים"
    /> 
    
    // state.results  ? <Card>נמצאו {state.results.length} תוצאות</Card> 
     : null}
        
     {state.results &&  state.results.counters.find(x=>x.name === state.activeIndex).count > 0 &&
   
     <>
      <img   onClick={downloadExcel}  className={classes.excel} title="אקסל"   src={logoExcel} />
      <img   onClick={showGraph('body')}  className={classes.graph} title="גרפים"   src={graph} />
   </>
   

  }
</div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { 
       
    direction: 'ltr',
    //marginRight: '30%',
    marginTop:'8px',
    color: 'rgba(0,0,0,0.47)',
    backgroundColor: 'rgba(63,81,181,0.5)',
    // width: '30%',
    borderRadius: '8px',
  },
  pagination :{
    direction:'ltr',
    display :'inline-flex',   
  },
  excel:{
    height:'40px',
    paddingTop:'15px',
    
    cursor: 'pointer'
   
  },
  graph:{
    height:'50px',
    width:'30px',
    paddingTop:'15px',
    cursor: 'pointer',
   
   
  },
  

  '@global': {
    '.MuiTab-root': {
      minWidth: '120px'
    },
    '.MuiTablePagination-toolbar':{
      overflow:'hidden',
      //marginRight:'30px',
    },
    '.MuiSelect-select.MuiSelect-select':{
      color:'rgba(0,0,0,0.87)',
    },
    '.MuiDialog-paperScrollBody':{
      textAlign:'center'
    },
    '.MuiDialogContent' :{
        display:'blobk important'
    },
    '.MuiTablePagination-root  .MuiTypography-body2' :{
      fontSize :'1.1em'
    }


  }

  
 
}));

