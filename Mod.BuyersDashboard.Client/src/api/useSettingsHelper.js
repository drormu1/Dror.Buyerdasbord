import {  useContext } from 'react';
import axios from "axios";

import SearchContext from '../state/context';
import config from '../config';

export default function useSettingsHelper(){
  const {state, dispatch} = useContext(SearchContext);
  
  const ui = state.configuration && state.configuration.indicesInfo.some(i=>i.name === state.activeIndex)
  ?  state.configuration.indicesInfo.find(i=>i.name === state.activeIndex).ui 
  : null;
  
  const  translateField =(field) => {      
      if(ui)
      {           
          return ui.some(f=>f.key === field) ?  ui.find(f=>f.key === field).title : field;
      }
  }
  
  const  getOrderOfRegularBox =(field) => {      
    if(ui)
    {           
        return ui.some(f=>f.key === field) ?  ui.find(f=>f.key === field).order : 100;
    }
}

  const aggregationOfActiveIndex = state.configuration ?  state.configuration.allAggregations.find(a=>state.activeIndex === a.index) : null;  
  const specialaggregationOfActiveIndex = state.configuration ?  state.configuration.specialAggregations?.filter(a=>state.activeIndex === a.index) : null;  
      
    
  
  return {ui,aggregationOfActiveIndex,specialaggregationOfActiveIndex,getOrderOfRegularBox, translateField}; //do not expose private functions
}


