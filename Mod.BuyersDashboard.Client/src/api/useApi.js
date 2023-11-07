import React ,{useContext} from 'react';
import axios from "axios";
import SearchContext,{loadingContext} from '../state/context';
import config from '../config';

export default function useApi(){
  
  let {state,dispatch} = useContext(SearchContext);
  const {loadingState,loadingDispatch} = useContext(loadingContext);
  

  const client = axios.create({    
    baseURL: import.meta.env.VITE_API_HOST,
    timeout: 350000, 
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'appToken' : localStorage.getItem("appToken"),
      'roleIds' : localStorage.getItem("roleIds"),

    }
  });

    // Add a request interceptor
    client.interceptors.request.use(function (config) {
  
     
      if(config.url === '/search' || config.url === '/init')
      {
        let d = new Date().getMilliseconds();
        //console.log('request SET_LOADING - on',d);
        loadingDispatch({type:'SET_LOADING', payload:{loading:true,d}});      
      }
      return config;
    }, function (error) {
      if(error.config.url === '/search' || error.config.url === '/init')
      {
        loadingDispatch({type:'SET_LOADING', payload:{loading:false}});
        dispatch({type:'SET_ERROR', payload:{errorMessage:error.response}});
        
      }
      //console.log('set loading - request  off');
      // Do something with request error
      return Promise.reject(error);
    });
  
    // Add a response interceptor
    client.interceptors.response.use(function (response) {
     
      // if(response.config.url === '/search' || response.config.url === '/init')
      // {
      //   loadingDispatch({type:'SET_LOADING', payload:{loading:false}});  
      // }
      let d = new Date().getMilliseconds();
      // console.log('response SET_LOADING off ',d);     
      loadingDispatch({type:'SET_LOADING', payload:{loading:false , d}});

      //console.log('set loading off');
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data


      return response;
    }, function (error) {
     
      // if(error.config.url === '/search' || error.config.url === '/init')
      // {
       
      //   loadingDispatch({type:'SET_LOADING', payload:{loading:false}});
      //   dispatch({type:'SET_ERROR', payload:{errorMessage:error.response}});
      // }
         loadingDispatch({type:'SET_LOADING', payload:{loading:false}});
         dispatch({type:'SET_ERROR', payload:{errorMessage:error.response}});
    

     // dispatch({type:'SET_SERVER_ERROR', payload:error.response}); 
      return Promise.reject(error);
    });
  
  

  const initCall = () => {           
      
      return client.get('/init')
      .then((response) => {
        //console.log(response.data);
        return response.data;
      })
      .catch((err) => 
      {
        console.log(err);
        return null;
      });
  }


  const autocomplete = (term) => {
    //console.log('call init');
    //var queryString = `term=${term}&activeIndex=${activeIndex}`;
  
    return client.get('/autocomplete', {
      params: {
        term
      }
    })
    .then((response) => {
      //console.log(response.data);
      return response.data;
    })
    .catch((err) => 
    {
      console.log(err);
      return [];
    });
  }




  const search = (term) => {
    console.log('STATE IS :' + state.activeIndex)
    return client.post('/search', 
      {
        term,
        activeIndex:state.activeIndex,
        page:state.pageNumber ?? 0,
        size:state.size ?? config.pageSize,
        andCondition:state.andCondition,      
        sort:state.sort,
        sortDirection:state.sortDirection,
        selectedAggregations:state.selectedAggregations,
        specialAggregations:state.specialAggregations
      }
    )
    .then((response) => {
  
      //console.log(response.data);
      var data = JSON.stringify(response.data).replace(/<</g, '< ').replace(/>>/g, ' >');     
        return JSON.parse(data);

 
    })
    .catch((err) => 
    {
      console.log(err);
      return [];
    });
  }
  
  const excel = (term,state) => {
  
    return client.post('/excel', 
      {
        term,
        activeIndex:state.activeIndex,
        page:0,
        size:9999,
        andCondition:state.andCondition,      
        sort:state.sort,
        sortDirection:state.sortDirection,
        selectedAggregations:state.selectedAggregations, 
        specialAggregations:state.specialAggregations      
      }
    )
    .then((response) => {   
     
      return {data : response.data};

    })
    .catch((err) => 
    {
      console.log(err);
      return {data:[]};
    });
  }       

 const getHashed = (term) => {
  const json = {
                term:term,
                activeIndex:state.activeIndex,
                selectedAggregations:state.selectedAggregations,
                size:state.size,
                pageNumber:state.pageNumber,                
                sortDirection:state.sortDirection,
                andCondition:state.andCondition,
                specialAggregations:state.specialAggregations
              };

  return JSON.stringify(json);
 };

  const fetchSearch = async (term) => {        
    var term = term ?? state.term;
    if(term && term.length > 2)
    { 
     
      const hashed = getHashed(term);
      //console.log(hashed);
      if(state.hashed ===  hashed)
        return;
      
        console.log("gong to API ===> ::" + term);
     
      //dispatch({type:'SET_PREV_HASH', payload:hashed});    
     ///// dispatch({type:'SET_AUTOCOMPLETE_RESULTS', payload:[]});  

      return search(term, state).then(results => {                
        dispatch({type:'SET_ACITVE_RESULTS', payload:{results,hashed}});            
    });    
  }
  else if(term.length == 0)
  {
    const hashed = getHashed(term);
    dispatch({type:'SET_ACITVE_RESULTS', payload:{results:[],hashed}});
  }
  };


  // const fetchSearchNonActives = async (term) => {           
  //   return searchNonActives(term).then(res => { 
  //     return res;                                 
  //       });
  //     }; 

  return {initCall, autocomplete, search, excel,fetchSearch};

}

