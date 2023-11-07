import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React, { useContext, useEffect } from 'react';
import useApi from '../../api/useApi';
import SearchContext from '../../state/context';
import _ from 'lodash';

export default function SelectedAggregations() {
  const {search}= useApi(); 
  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  const {fetchSearch} = useApi(); 



  useEffect(() => {
   
    //console.log('useeffect - selectedAggregations');
    fetchSearch().then(res=> {             
    })}
  , [state.selectedAggregations]
  )
  
 


function removeActiveAgg(value)
{  

  dispatch({type:'REMOVE_ACTIVE_AGGREGATION_KEY', payload:value});        
}
function showSelected()
{

  return  (_.sortBy(state.selectedAggregations)).map((i)=>
                                              
  <Button variant="contained" size="small"  key={i} color="primary" className={classes.buttons} onClick={(e)=>e.preventDefault()}

   endIcon={<DeleteForeverIcon style={{marginRight:'10px','marginLeft':'-10px',cursor:'pointer'}}  titleAccess="הסר סנן"   onClick={(e)=>removeActiveAgg(i)}/>}
   >
     {unescape(i.split('___')[1]).substr(0,15)}
 </Button>);
}
  //const indicesInfo = state.configuration ?  state.configuration.indicesInfo.map(a=>a) : [];


  return (
    <div  style={{display:'flex'}}>  
 
     {state && state.selectedAggregations ?      
      showSelected()
      : null}  
           
      </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {    
    
    backgroundColor:'rgba(0, 0, 0, 0.1)',
    marginTop :'0',   
    marginBottom:'10px',
    
  },

  buttons:{
    marginLeft:'1px',
    fontSize:'0.7em',
    backgroundColor: 'primary',
    marginRight:'10px' ,
    borderRadius: '10px',
    cursor:'default'
  },
  '@global': {
    'MuiButton-label': {
      
      overflow:'hidden',
      whiteSpace: 'nowrap',
      fontSize:'0.92em'
    
    }
  }
 
}));

