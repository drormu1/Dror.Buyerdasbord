import config from '../config';
import _ from 'lodash';
export  function LoadingReducer(state, action){
    
    //console.log('in reducer action:' + action.type + "; value: "  + action.payload); 
    switch(action.type){      
        case 'SET_LOADING':                              
            document.loading = action.payload.loading;
            state.loading= action.payload.loading;                      
            return {...state};
        default:
                return {...state};
        }
    }       
export default function reducer(state, action){
    
    //console.log('in reducer action:' + action.type + "; value: "  + action.payload); 
    switch(action.type){
        case 'SET_INIT_CONFIGURATION':                    
            state.configuration= action.payload;
            //state.activeIndex= action.payload=== null ? ( state.activeIndex === null ? config.defaultIndex : state.activeIndex) : action.payload.indices[0];
            state.activeIndex= action.payload.indices[0];
            //console.log(state.configuration)
        return {...state};      
        
        case 'SET_ERROR':                                         
            state.errorMessage= action.payload.errorMessage;
            return {...state};
      
                    
        case 'SET_AUTOCOMPLETE_RESULTS':                                  
            state.autocompleteResults= action.payload.res;
            state.term = action.payload.term;          
            state.pageNumber=0; 
            return {...state};        

        case 'SET_TERM':             
            state.term = action.payload;          
            state.pageNumber=0;         
            state.autocompleteResults =[];                               
            return {...state};
        

        case 'SET_ACTIVE_INDEX':        
            state.activeIndex= action.payload;
            state.pageNumber=0;            
            state.autocompleteResults =[];  
            state.tempAggregations=[];                        
            state.selectedAggregations=[];
            state.specialAggregations=[];             
            return {...state};

        case 'SET_ACITVE_RESULTS':
            state.loading=false;  
            state.firstSearchDone = true,                          
            state.results= action.payload.results;
            state.hashed= action.payload.hashed;
            state.counters= action.payload.counters ?? state.counters;
            state.autocompleteResults =[]; 
            return {...state};

     
        case 'SET_PAGE_SIZE_CHAGED':                                             
            state.pageNumber=0;           
            state.size= action.payload;
            return {...state};
        
            case 'SET_PAGE_CHAGED':                                         
            state.pageNumber= action.payload;
            return {...state};
        

            case 'REMOVE_ACTIVE_AGGREGATION_KEY':         
                state.pageNumber=0;                                 
                state.selectedAggregations= state.selectedAggregations.filter(e => e !== action.payload);           
                return {...state};
        
            case 'ADD_ACTIVE_AGGREGATION_KEY':     
                //state.selectedAggregations=[...new Set([...state.tempAggregations,...state.selectedAggregations])];

                if(!state.selectedAggregations.includes(action.payload))
                {
                state.pageNumber=0;                 
                state.selectedAggregations= [...state.selectedAggregations,action.payload]
                }
                return {...state};
            
            
         

                
            case 'ADD_TEMP_AGGREGATION_KEY':     
                if(!state.tempAggregations.includes(action.payload))
                {
                    //state.pageNumber=0;                 
                state.tempAggregations= [...state.tempAggregations,action.payload]
                }
                return {...state};
        

            case 'SET_ALL_AGGREGATIONS':                         
                state.pageNumber=0;  
                state.selectedAggregations=[...new Set([...state.tempAggregations,...state.selectedAggregations])];
                state.tempAggregations=[];
                return {...state};

            case 'REMOVE_ALL_AGGREGATIONS':                       
                state.pageNumber=0;           
                state.specialAggregations=[];      
                state.selectedAggregations=[];
                state.tempAggregations=[];
                return {...state}; 
        
           

        // case 'UPDATE_SPECIAL_AGGREGATIONS': 
        //     let others =  state.specialAggregations.filter(a=>(a.index !== action.payload.index || a.field!== action.payload.field ));
        //     let newArr = [...others,action.payload];             
        //     state.specialAggregations= newArr;
        //     return {...state};


        case 'UPDATE_SPECIAL_AGGREGATIONS':                   
        state.specialAggregations= action.payload;
        return {...state};


        default:
            return {...state};
    }
}

