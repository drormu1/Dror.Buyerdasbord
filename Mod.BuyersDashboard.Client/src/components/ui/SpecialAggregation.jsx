import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Search from '@material-ui/icons/Search';
import parse from 'html-react-parser';
import React, { useContext, useEffect,useRef ,useState} from 'react';
import '../../css/sideMenu.css';
import SearchContext from '../../state/context';
import Switch from '@material-ui/core/Switch';
import useSettingsHelper from '../../api/useSettingsHelper';
import TextField from '@material-ui/core/TextField';
import useApi from '../../api/useApi';

import Typography from '@material-ui/core/Typography';

export default function SpecialAggregation(props) {
    const classes = useStyles();
    const {state, dispatch} = useContext(SearchContext);
    const {fetchSearch} = useApi(); 
    const {ui,translateField,aggregationOfActiveIndex} = useSettingsHelper();
    
    const initialMinimizedAggBox = () => localStorage.getItem("MinimizedAggBox") ?? '';    
    const [minimizedAggBox, setMinimizedAggBox] = useState(initialMinimizedAggBox);
    const aggBox = state.configuration.specialAggregations?.find(a=>a.index===state.activeIndex &&  a.field=== props.field);

    useEffect(() => localStorage.setItem("MinimizedAggBox", minimizedAggBox), [minimizedAggBox]);

    const [specials,setSpecials] = useState(state.specialAggregations);

    function isMinimizedAggBox(aggBox)
    {     
        if( minimizedAggBox != null && minimizedAggBox.split(',').find(a=>a=== "switch___" + state.activeIndex +'___'+aggBox.field))
        {
            return true;
        }              
        return false;
    }
    const handleMinimizedChange = (event) => {       
       var existing =minimizedAggBox;
       existing = existing ? existing.split(',') : [];

        if(event.target.checked)
        {
            if( existing.indexOf(event.target.name) === -1 )
            {
                existing.push(event.target.name);            
            }
        }
        else
        {
            existing =  existing.filter (a=> a !== event.target.name ); 
        }
        setMinimizedAggBox(existing.toString());
        

      };
     


      useEffect(() => {
        //console.log('useeffect - specialAggregations',state.specialAggregations);  
        setSpecials(state.specialAggregations);
        const listener = event => {
          
          if ((event.code === "Enter" || event.code === "NumpadEnter" || event.button != null)
          && event.target.id.split('___').length ===3) {
          
            if(!state.term ||  state.term.length < 2)
            {                
              return;
            }  
            
            fetchSearch().then(res=> {           
               
              } );
          }
        };
          document.addEventListener("keydown", listener);    
      
          return () => {
            document.removeEventListener("keydown", listener);         
          };
      }, [state.specialAggregations]);

      
      useEffect(() => {
   
        if(document.UpdateSpecialInContextTimer)
        {    
          //console.log('clearTimeout ',document.UpdateSpecialInContextTimer)
          clearTimeout(document.UpdateSpecialInContextTimer);
        }
        document.UpdateSpecialInContextTimer = setTimeout(function(){ insideTimeoutHandler()}, WAIT_INTERVAL_AUTOCOMPLETE);
        //console.log(' UpdateSpecialInContextTimer ',document.UpdateSpecialInContextTimer)
      }, 
      [specials]
      );

  const WAIT_INTERVAL_AUTOCOMPLETE = 1000;
  function handleChange(event) {
    
    //event.preventDefault();  
    let obj  = event.target.id.split('___');
    //let specials=specialAggregations;
    
    let newAgg = {'index':obj[0],'field':obj[1]};
    let existing = specials.find(a=> (a.index === obj[0] && a.field === obj[1] ));
    let settings = state.configuration.specialAggregations?.find(a=> (a.index === obj[0] && a.field === obj[1] ));

    if(obj[2] === 'from'){
        newAgg.from =  event.target.value;
        newAgg.to = existing?.to;
    }
    else
    {
      newAgg.from = existing?.from;
      newAgg.to =  event.target.value;
    } 
    newAgg.type=settings.type;
    //dispatch({type:'UPDATE_SPECIAL_AGGREGATIONS', payload:newAgg}); 
    
    let others =  specials.filter(a=>(a.index !== newAgg.index || a.field!== newAgg.field ));
    let newArr = [...others,newAgg];             
    setSpecials(newArr);      
  }
  
  function insideTimeoutHandler()
  { 
    dispatch({type:'UPDATE_SPECIAL_AGGREGATIONS', payload:specials});     
  }

  function getValueOfTextField(aggBox,isFrom)
  {
    const agg = state.specialAggregations.find(a=>a.index===aggBox.index && a.field===aggBox.field);
  }
      
  

  function getControl(aggBox)
  {             
           return  <div> <TextField className={classes.textField}          
            id={aggBox.index + "___" +aggBox.field+"___from"}  
            //ref={`${aggBox.index+}_${aggBox.field}_reffrom`} 
            onChange={handleChange}
            label={aggBox.labels[0]}             
            variant="outlined"
            value={specials.find(a=>a.index===aggBox.index && a.field===aggBox.field)?.from ?? ''}
            type={aggBox.type}
            InputLabelProps={{
                shrink: true,
              }}
            size="small"
            />
            
            <TextField className={classes.textField}
            id={aggBox.index + "___" +aggBox.field+"___to"}
            value={specials.find(a=>a.index===aggBox.index && a.field===aggBox.field)?.to ?? ''}
            onChange={handleChange}
            label={aggBox.labels[1]}
            type={aggBox.type}
            InputLabelProps={{
                shrink: true,
              }}
            variant="outlined"
            size="small"
            />   
            </div>                            
 }     
 


return (
        <div className={classes.aggsGroupRoot}>                                                             
           <div   key={aggBox.field} className={classes.aggsGroupBox}>                         
               <FormControl component="fieldset" className={classes.aggsGroup}>                                                        
                            <FormControlLabel
                                control={                                     
                                     <Switch  checked={isMinimizedAggBox(aggBox)} onChange={(event) => handleMinimizedChange(event,aggBox)}   color="default"
                                     name= {"switch___"+state.activeIndex+'___'+aggBox.field} />}

                                label={<Typography className={classes.legendLabel}>{translateField(aggBox.field)}</Typography>}
                                className={classes.legend}
                       />                       
                                                    {/* <FormLabel                                                        
                              className={classes.legend}>{translateField(aggBox.field)}</FormLabel>   */}
                                                  
                            
                            <Divider/>
                            { !isMinimizedAggBox(aggBox) &&  getControl(aggBox)}
                          
                          <div style={{marginTop:'-10px',textAlign:'left',paddingLeft:'10px'}}>
                            {/* <Search titleAccess="���� ���" onClick={(e)=>setSpecialAggsInContext(e,aggBox)} style={{cursor:'pointer',width:'20px',color:'rgba(63,81,181,0.84)' }} /> */}
                          </div>
                          
                        </FormControl>
           </div>
        </div>
        )
};
                                              
    
    


const useStyles = makeStyles((theme) => ({
    aggsGroupBox: {
      display: 'flex',      
      color:'rgba(0, 0, 0, 0.74)',
      marginBottom :'5px',
      overflowX: 'hidden',
      // 'max-height': '150px',
      overflowY: 'hidden',
      borderRadius: '5px',
      textAlign: 'center',
      
      
      paddingBottom:'8px'
    },  
    aggsGroupRoot:
    {        
        padding:theme.spacing(0),
        
    },
  
    aggsGroup: {                  
        margin: theme.spacing(0),
        padding: theme.spacing(0),
        

    },
    textField:
    {               
        color:'rgba(0, 0, 0, 0.74)',
        marginRight:'-30px',
        fontSize:'0.75em',
        transform: "scale(0.75)",
        padding:'5px',
        marginTop:'5px'
        
    },
    legendLabel: {
      color :'rgb(63,81,181)',              
      fontWeight:'bold',
  },
  legend: {   
       
    marginRight:'-10px',
    maxHeight:'12px',
    width: '260px',        
    backgroundColor:'rgba(0, 0, 0, 0.025)',
    padding: '3px 0',  
    paddingRight:'20%',                    
    '&:focused': {
        background: "#efefef"
      },
},
  
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),          
        },  
        '.MuiInputBase-input':             
        {
            color:'rgba(0, 0, 0, 0.74)',
        },
        '.MuiOutlinedInput-input' :{
            padding: '18.5px 10px'
        },
        '.MuiFormControlLabel-root': {
          paddingRigth: '0px'
        },
        '.MuiTypography-body1':{
           // color:'red',
           lineHeight:1,
           fontSize:'0.92em',
        },
        
    },

    '@global': {
        '.MuiFormControlLabel-root': {
          paddingRigth: '0px'
        },
        '.MuiInputBase': {
            background: 'red'
          }
    }
    
  }));

