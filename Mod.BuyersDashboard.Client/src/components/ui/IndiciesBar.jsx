import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useContext, useEffect } from 'react';
import useApi from '../../api/useApi';
import SearchContext from '../../state/context';
import Pager from './Pager';


export default function IndiciesBar() {
  const {search, fetchSearch} = useApi(); 
  
  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


      
  useEffect(() => {   
    //console.log('useeffect - indiciesbar');
    fetchSearch().then(res=> {                    
    });
   }, [state.activeIndex])


      
 const activeIndexChange =  (event) => 
 {  
    const  index = event.target.parentElement.id;
    event.preventDefault();
    dispatch({type:'SET_ACTIVE_INDEX', payload:index});
   
 } 

 function getCounterPerIndex (indexName)  {
//  debugger;
//    if(indexName === state.activeIndex )
//    {   
//      return ` (${state.results.counters})`;
//    }
   
   return (state.results.counters  && state.results.counters.some(a=>a.name===indexName)) ? 
  ` (${ state.results.counters.find(a=>a.name===indexName).count})`  : ""
 }

  const indicesInfo = state.configuration ?  state.configuration.indicesInfo.map(a=>a) : [];
  
  return (  //,justifyContent: 'space-between'
  
    <div  xs={12} style={{display:'flex',marginTop:'-80px',maxHeight:'60px',paddingBottom:'20px' ,top: '80px', position: 'sticky',zIndex:'100',background:'#fff'}}>
     
        <Paper  xs={7} className={classes.root}  style={{
          // overflowX:'scroll',overflowY:'hidden',
        maxWidth:'90%'     ,
        overflow:'hidden',
        //display:'inline-flex'
          
        }}>
     
      <Tabs  position="fixed"        
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        
      >
        {indicesInfo.map((i)=>
          <Tab   onClick={activeIndexChange} id={i.name} label={i.title + getCounterPerIndex(i.name)}  key={i.name}/>)
      }               
      </Tabs>  

      </Paper>
      <div  style={{marginRight:'100px',marginTop:'-10px',background:'#fff'}}>
      {<Pager xs={5} ></Pager>}
      
       </div>
      </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {    
    
    backgroundColor:'rgba(0, 0, 0, 0.1)',
    marginTop :'0',   
    marginBottom:'10px'
  },

  
  '@global': {
    '.MuiTab-root': {
      minWidth: '120px'
    }
  }
 
}));

