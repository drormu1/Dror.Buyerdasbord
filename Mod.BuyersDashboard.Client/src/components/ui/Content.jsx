import React, {useEffect, useContext } from 'react';
import SearchContext from '../../state/context';
import IndiciesBar from './IndiciesBar';
import ResultsGrid from './ResultsGrid';
import SelectedAggregations from './SelectedAggregations';

export default function Content() {
    // const classes = useStyles();
    const {state} = useContext(SearchContext);
    // useEffect(() => {
       
    //   },[state.SelectedAggregations]);
    
    return (
        <div style={{textAlign:'center'}}>
            { state.configuration && state.configuration.indices.length > 0 ?
            <>
             <IndiciesBar/>             
             
            </>
            : null }
            
            <SelectedAggregations/>
            <ResultsGrid/>    
        </div>
    )
};  


// const useStyles = makeStyles((theme) => ({
//     grow: {
//       flexGrow: 1,
//     }
//   })); 
   

