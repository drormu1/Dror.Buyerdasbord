import { makeStyles } from '@material-ui/core/styles';
import SearchContext from '../../state/context';
import React, { useContext, useEffect } from 'react';
//import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import useSettingsHelper from '../../api/useSettingsHelper';

import Graph from './Graph';
import '../../css/graphList.css';

export default function GraphList() {
  const {state, dispatch} = useContext(SearchContext);
  const classes = useStyles();
  const {ui,translateField,aggregationOfActiveIndex} = useSettingsHelper();
   
  


  return (

  <div className={classes.root}>      
   {
    aggregationOfActiveIndex.aggs.map ( aggBox => ( 
          <div key={"graphdiv_"+aggBox.field}>
            <Graph  key={"graph_"+aggBox.field}  aggBox={aggBox}></Graph>
          </div>
      ))
   }
  </div>  
  )
  };




const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  content:{
    position:'relative',
    right:'50%',
    padding:'10px'
  }
}));


