import { makeStyles } from '@material-ui/core/styles';
import SearchContext from '../../state/context';
import React, { useContext, useEffect } from 'react';
//import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'

import useSettingsHelper from '../../api/useSettingsHelper';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import _ from 'lodash';


export default function Graph(props) {
  const {state, dispatch} = useContext(SearchContext);
  const classes = useStyles();
  const {ui,translateField,aggregationOfActiveIndex} = useSettingsHelper();
  ChartJS.register(...registerables);

  
  const data = {
    labels: [],
    datasets: [
      {
        //barPercentage: 0.9,
       // barThickness: 10,
        maxBarThickness: 25,

        label:'ggg',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {      
      legend: {
        display: false
      }
    },
    scales: {
    
      x: {
       display:true,
       ticks:{
        minRotation:90,
        maxRotation:90
      },
    },
      y: 
        {
          ticks: {
            beginAtZero: true,
          },
        }
      
    },
  };
  
  function getData(aggsBox)
  {
     
    if(state.results.aggregations)
    {           
        if(state.results.aggregations["by_"+ aggsBox] && state.results.aggregations["by_"+ aggsBox].buckets.length > 0)
        {
         
          let boxAggregations = state.results.aggregations["by_"+ aggsBox].buckets;
                if(boxAggregations )
                {                 
                  if (boxAggregations.length > 50)
                  {
                    boxAggregations =_.orderBy( boxAggregations, 'doc_count','desc' ).slice(0,50);
                  }
                  
                data.labels = boxAggregations.map(a => a.key)  ;
                boxAggregations.map(a => data.datasets[0].data.push(a.doc_count));                 
                data.datasets[0].label = '' ;
                }
                
                
        }
       
        return data;
  }
}


  return (

    <>
    <div  key={props.aggBox.field} style={{position: 'relative', height: '280px',marginTop:'-20px'}}>
      <div   className='header'>            
        
        <span>{translateField(props.aggBox.field)} {state.results.aggregations["by_"+ props.aggBox.field].buckets.length > 40  ? "(מוצגות עד 50 עמודות ראשונות) " : "" } </span>
     
      </div>
      
      <Chart  type='bar'  key={"cahart_"+ props.aggBox.field} data={getData(props.aggBox.field)} options={options}  />      
      <div style={{clear:'both'}}></div>
  </div>
  
  <div  className={classes.pagebreak}></div>
  </>
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
    padding:'30px'
  },


  '@media print': {
    display: 'block !important',
    'pagebreak' :{ 
    
      height:'50vh',
       
     
    }
},
  
}));


