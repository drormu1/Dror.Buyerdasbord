import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import parse from 'html-react-parser';
import React, { useContext, useEffect ,useState,useMemo} from 'react';
import '../../css/sideMenu.css';
import SearchContext from '../../state/context';
import Switch from '@material-ui/core/Switch';
import useSettingsHelper from '../../api/useSettingsHelper';
import SpecialAggregation from './SpecialAggregation';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

export default function SideMenu() {
    const classes = useStyles();
    const {state, dispatch} = useContext(SearchContext);
    const {translateField,getOrderOfRegularBox,specialaggregationOfActiveIndex,aggregationOfActiveIndex} = useSettingsHelper();
    const allIndexAggregationsOrdered = getOrderedBox();
    const initialMinimizedAggBox = () => localStorage.getItem("MinimizedAggBox") ?? '';
    const [minimizedAggBox, setMinimizedAggBox] = useState(initialMinimizedAggBox);
    
    useEffect(() => { 
        //console.log('side menu localStorage effect');
        localStorage.setItem("MinimizedAggBox", minimizedAggBox)
    }, [minimizedAggBox]);

    // useEffect(() => { 
    //     console.log('use effect side menu');
    // },[state.term]);
   
    

    function isMinimizedAggBox(aggBox)
    {
        if( minimizedAggBox != null && minimizedAggBox.split(',').find(a=>a=== "switch___" + state.activeIndex +'___'+aggBox.field))
        {
            return true;
        }
        return false;
    }
    function getOrderedBox()
    {
        let orederd = [];
        for(var i=0;i<aggregationOfActiveIndex.aggs.length; i++)
        {

            orederd.push({field:aggregationOfActiveIndex.aggs[i].field,
                order:getOrderOfRegularBox(aggregationOfActiveIndex.aggs[i].field) ?? 100,isSpecial:false});
        }
        for(i=0;i<specialaggregationOfActiveIndex?.length; i++ )
        {
            orederd.push({field:specialaggregationOfActiveIndex[i].field,order:specialaggregationOfActiveIndex[i].order ?? 100,isSpecial:true});
        }

        return _.sortBy( orederd, 'order' );

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
        console.log(' existing :  ' + existing.toString());

      };



    function getAggregationButtons()
    {

           if(aggregationOfActiveIndex)
                return <div style={{marginBottom:'5px',padding:'1px 10px'}}>
                     <Button
                        variant="contained"
                        color="primary"
                        size="small"                
                        onClick={(e)=>setAllAggregations(e)}                    
                        className={classes.button}
                        startIcon={<SearchIcon  titleAccess="נקה סננים "/>}                        
                    >
                            &nbsp;הפעל סננים
                    </Button> 
                    &nbsp;
                     <Button
                        variant="contained"
                        color="primary"
                        onClick={(e)=>clearAllAggregations(e)}
                        size="small"
                        style={{background: 'rgba(63,81,181,0.5)',float:'left'}}
                        className={classes.button}
                        startIcon={<DeleteIcon titleAccess="נקה סננים" />}
                    >
                          &nbsp;נקה סננים
                    </Button>
                  
                   

                </div>;
    }

    // function clearAllSelectedAggregations(e)
    // {
    //     e.preventDefault();
    //     dispatch({type:'REMOVE_ALL_ACTIVE_AGGREGATIONS'});

    // }

    function clearAllAggregations(e)
    {
        e.preventDefault();
        dispatch({type:'REMOVE_ALL_AGGREGATIONS'});
    }
    function setAllAggregations(e)
    {
        e.preventDefault();
        dispatch({type:'SET_ALL_AGGREGATIONS'});
    }

    function handleCheckBoxChange(e)
    {       
       if(e.target.checked)
       {
           setTimeout(dispatch,3,{type:'ADD_TEMP_AGGREGATION_KEY', payload:e.target.name})
        
       }
       //need remove check box
       else{
                if(state.selectedAggregations.some(a => a == e.target.name))   
                {
                    dispatch({type:'REMOVE_ACTIVE_AGGREGATION_KEY', payload:e.target.name});
                }
                else
                {        
                    setTimeout(dispatch,3,{type:'REMOVE_TEMP_AGGREGATION_KEY', payload:e.target.name})
                }
        }
    }

    function singleAggClicked(e)
    {              
        setTimeout(dispatch,3,{type:'ADD_ACTIVE_AGGREGATION_KEY', payload:e.target.name});
    }


    const  isAggChecked = (key) =>
    {     
        let aggs = [...new Set([...state.selectedAggregations,...state.tempAggregations])];
        return state && aggs.some(a=>a === key);
    }

    function getCountOffSingAgg(aggsBox,agg)
    {

        if(state.results.aggregations)
        {

            if(state.results.aggregations["by_"+ aggsBox] && state.results.aggregations["by_"+ aggsBox].buckets.length > 0)
            {
                const boxAggregations = state.results.aggregations["by_"+ aggsBox].buckets;
                if(boxAggregations)
                {
                    if(boxAggregations.some(a=>a.key === agg))
                    {
                        return boxAggregations.find(a=>a.key === agg).doc_count;

                    }
                }
            }
            return 0;
        }
    }
    function getSingleAggLabel(aggsBox,agg)
    {
        let count =getCountOffSingAgg(aggsBox,agg);
        let countSpan = '';
        if(count >  0)
        {
            count =count.toLocaleString(navigator.language, { minimumFractionDigits: 0 })
            countSpan = <span style={{float:'left',fontSize:'0.95em'}}>{count}</span>;
        }           
        return (<>
                    <span style={{width:'80%',textAlign:'rigth',whiteSpace:'nowrap',overflow:'hidden'}} >          
                            <a  style={{color:'#3f51b5'}}
                            name={escape(aggsBox+"___"+agg)}
                             onClick={(e)=>singleAggClicked(e)}  href="#" className={classes.singleAgg}>{agg}</a>          
                    </span>
                    <span style={{width:'20%',float:'left',paddingRight: '2px',fontSize:'0.8em',fontFamily :'sans-serif'}}>
                        {countSpan}
                    </span> 
                    {/* <span style="width:80%;text-align:rigth;white-space:nowrap;overflow:hidden" >          
                            <a  style="color:#3f51b5" onClick={handleCheckBoxChange} href="#" className={classes.singleAgg}>{agg}</a>          
                    </span>
                    <span style="width:20%;float:left;padding-right: 2px;font-size:0.75em">
                        {countSpan}
                    </span> */}
                    </>) ;
    }
    // function isAggDisabled(aggsBox,agg)
    // {
    //     return getCountOffSingAgg(aggsBox,agg) === 0 ;
    // }

    // const getAggsOfBoxMemo = useMemo((field)=>{

    //   return getAggsOfBox(field);
    // },[aggregationOfActiveIndex.aggs,state.selectedAggregations]);

    function getAggsOfBox(field)
    {
        let aggs = [];
        //console.log('field => '+field)
         let aggsBox =aggregationOfActiveIndex.aggs.find(a=>a.field===field);

         if(aggsBox && aggsBox.list && aggsBox.list.length > 0 && aggsBox.list.length <= 100)
         {
             aggs=  aggsBox.list;
         }
         else if(state.results.aggregations && state.results.aggregations["by_"+ aggsBox.field])
         {

             if(state.results.aggregations["by_"+ aggsBox.field].buckets.length > 2000)
             {
                 aggs =  state.results.aggregations["by_"+ aggsBox.field].buckets.map(a=>a.key);
             }
             else
             {
                 aggs=  aggsBox.list;
             }
         }
        
         aggs = aggs.sort();
         //for patials agg - >  size 0
         //if (ui.aggregationFilter
         
         //aggs =  state.results.aggregations["by_"+ aggsBox.field].buckets.map(a=>a.key);
         const ui = state.configuration && state.configuration.indicesInfo.some(i=>i.name === state.activeIndex)
         ?  state.configuration.indicesInfo.filter(i=>i.name === state.activeIndex)[0].ui 
         : null;

         if(ui.find(f=>f.key === aggsBox.field).aggregationFilter === true)
         {
            aggs =  state.results.aggregations["by_"+ aggsBox.field].buckets.map(a=>a.key);
         }

         const selctedInThisBox = state.selectedAggregations.filter(a=> a.includes(unescape(aggsBox.field+"___")))?? [];

         if(selctedInThisBox.length > 0)
         {


             aggs = aggs.filter(item => !selctedInThisBox.includes(escape(aggsBox.field+"___"+item)));

             selctedInThisBox.forEach((selected) => {
                 selected =selected.replace(aggsBox.field+"___","");
                 aggs.unshift(unescape(selected))
             });

         }
         return aggs;
    }

    // function renderSpecialAggerations()
    // {
    //     let html='';
    //     switch(state.activeIndex){
    //         case 'orders':
    //             html+= `<div>22222</div>`;
    //             break;


    //         default:
    //             break;

    //     }
    //     return parse(html);
    // }

    function getNumOfAggregationsInActiveIndex()
    {

      return   aggregationOfActiveIndex?.aggs?.length + specialaggregationOfActiveIndex?.length;
    }



    return (
        <div className={classes.aggsGroupRoot}>            
            {getAggregationButtons()}
            <br/>
            {/* <SpecialAggregations></SpecialAggregations> */}

             {allIndexAggregationsOrdered.map ( aggBox => (

                         <div className={classes.aggsGroupBox} style={{ maxHeight:getNumOfAggregationsInActiveIndex() > 3 ? '120px': '500px',overflowY:aggBox.isSpecial?'hidden':'auto'}}  key={aggBox.field}>

                        {aggBox.isSpecial ?

                        <SpecialAggregation field={aggBox.field}></SpecialAggregation>
                        :
                        <FormControl component="fieldset" className={classes.aggsGroup}>

                                <FormControlLabel
                                        control={ getNumOfAggregationsInActiveIndex() >3 ?

                                            <Switch  checked={isMinimizedAggBox(aggBox)} onChange={(event) => handleMinimizedChange(event,aggBox)}   color="default"
                                            name= {"switch___"+state.activeIndex+'___'+aggBox.field} />  :

                                            <span  style={{width:'50px'}} />}

                                        label={<Typography className={classes.legendLabel}>{translateField(aggBox.field)}</Typography>}
                                        className={classes.legend}
                            />
                                                    {/* <FormLabel
                              className={classes.legend}>{translateField(aggBox.field)}</FormLabel>   */}

                            <Divider/>

                            {!isMinimizedAggBox(aggBox) &&
                            <FormGroup className={classes.aggsGroupChild}>
                                {getAggsOfBox(aggBox.field).map((a) => (
                                    <div key={escape(aggBox.field+"___"+a)} style={{display:'inline-flex',width:'98%'}}>
                                         <Checkbox className={classes.aggCheck}
                                            name={escape(aggBox.field+"___"+a)}
                                        // disabled={isAggDisabled(aggBox.field,a)}
                                            checked={isAggChecked(aggBox.field+"___"+escape(a))}
                                            onChange={(e)=>handleCheckBoxChange(e)}    
                                            color="primary"/>

                                       {getSingleAggLabel(aggBox.field,a)}
                                        </div>
                                ))}
                                {getAggsOfBox(aggBox.field).length > 2000 ? <span className={classes.findMoreAggregations}>נמצאו עוד סננים , מקד את מילת החיפוש</span> : null}
                            </FormGroup>
                            }
                            </FormControl>
                        }
                         </div>

                            /* <FormControlLabel
                            style={{direction:'ltr',marginRight:'5px'}}
                            value="end"
                            control={<Switch color="primary" />}
                            label="bool"
                            labelPlacement="start"
                            /> <FormHelperText>You can display an error</FormHelperText> */
                  ))
             }
             <br/>
             {getAggregationButtons()}

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
      overflowY: 'auto',
      borderRadius: '5px',
      //textAlign: 'center',
      border : '1px solid rgba(0, 0, 0, 0.14)' ,
     // maxHeight:'120px',
     fontWeight: 'bold',

    },
    findMoreAggregations:{
        fontSize: '0.8em',
        fontWeight: 'bolder',
        padding: '5px',
    },
    aggsGroupRoot:
    {
        padding:theme.spacing(0),
        marginTop: '-20px',
        overflowY:'auto',
        height:'90vh'
    },
    

    aggsGroup: {
        margin: theme.spacing(0),
        padding: theme.spacing(0),


    },
    legendLabel: {
        color :'rgb(63,81,181)',
        fontWeight:'bold',
    },
    legend: {

        marginRight:'-10px',
        maxHeight:'12px',
        width: '260px',
        backgroundColor:'rgba(0, 0, 0, 0.04)',
        padding: '3px 0',
        paddingRight:'20%',
        '&:focused': {
            background: "#efefef"
          },
          
    },
    label:
    {

        fontSize:'0.85em',
        width : '180px',
        overflow:'hidden',
        textAlign:'right',
        '&:focused': {
            background: "#efefef"
          },

        
    },
    singleAgg :{
        fontFamily:'sans-serif',
        fontSize:'0.92em',
        textDecoration:'underline',
    },
    aggCheck:
    {
        //marginRight:'-12px',
        fontSize:'0.75em',
        transform: "scale(0.75)",
        padding:'0px',
    },
    aggsField:{

            fontSize:'0.94em',
            height:'1.1em',
            marginRight:0,

    },
    button:{
        padding:'2px 5px',
    },
    filter:
    {
        padding:'0',
        margin:'2px',
        float:'left',
        minWidth:'45px',
        boxShadow: 'none'     
    },
    '@global': {

        '.MuiFormControlLabel-root': {
        //   paddingRight: '0px'
        },
        '.MuiTypography-body1':{
           // color:'red',
           lineHeight:1,
           fontSize:'0.92em',
        },
        '.MuiFormGroup-root' :{
            marginTop:'5px'
        },
        '.MuiDivider-root' :{
            background:'none'
        },
        '.MuiButton-startIcon' :{
            marginRight:0
        }
    },


  }));

