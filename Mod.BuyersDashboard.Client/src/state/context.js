import React from 'react';
import config from '../config';

var initialState = {   
    errorMessage:null,

    configuration:null,
    hashed:null,
    appTitle: ' ' +import.meta.env.VITE_CLIENT_NAME + '  ' + import.meta.env.VITE_DEPLOYMENT_NAME,
    departmentForLogo: import.meta.env.VITE_DEPARTMENT_FOR_LOGO,
    
    //darkMode: localStorage.getItem('darkMode') && localStorage.getItem('darkMode') === 'true' ? true : false,       
    //activeIndex: config.defaultIndex,
    
    activeIndex:null,
    results: null,
    counters:[],
    firstSearchDone:false,
    autocompleteResults :[],
    selectedAggregations:[],
    //specialAggregations:[],

    size:config.pageSize,
    pageNumber:0,
    term:'',
    //term:'',
    andCondition:'or',
    sortDirection:null,

    specialAggregations:[],
    tempAggregations:[],

};



const stateContext = React.createContext({
    ...initialState
})



var loadingState = { loading:false , d : new Date().getMilliseconds()};
export const loadingContext = React.createContext({
   ...loadingState
   })

export default stateContext;

