import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import SearchContext from '../../state/context';
import ResultSingle from './ResultSingle';

export default function ResultsGrid() {
    const classes = useStyles();
    const {state} = useContext(SearchContext);
     let i=0
    
    //const currentIndexAggregations = state.configuration ?  state.configuration.allAggregations.find(a=>state.activeIndex === a.index) : null;    
    const ui = state.configuration && state.configuration.indicesInfo.some(i=>i.name === state.activeIndex)
     ?  state.configuration.indicesInfo.filter(i=>i.name === state.activeIndex)[0].ui 
     : null;

    // function translateField(field)
    // {
    //     if(ui)
    //     {           
    //         return ui.some(f=>f.key === field) ?  ui.find(f=>f.key === field).title : field;
    //     }
    // }

    

    return (
        <div id="all-results" className={classes.Root} style={{marginTop: '2px',paddingTop:'10px'}}>
       
            {!state.loading && state.results && state.results.hits.length> 0 ?      
                   
                       state.results.hits.map(r=>r).map ((res,index) =>  


                        <div  className={classes.box}  style={{background: index%2==0 ?'rgb(242,242,242,0.95)' : 'rgb(230,247,255,1)'}}  key={res._id}>              
                        <ResultSingle    result={res} ind={index}/>
                       
                        </div>
                        )
             : null
            }
           
         
           </div>
    )
};


const useStyles = makeStyles((theme) => ({
   
    Root:
    {   
        overflowY: 'auto',
        // height: '90vh',
        marginLeft: '5px',
        marginTop:'20px',
        flexGrow: 1,    
        padding:theme.spacing(0),        
    },
    box:{
        padding:'15px',
        borderRadius:'25px',
        marginBottom:'6px'
    }
  }));

