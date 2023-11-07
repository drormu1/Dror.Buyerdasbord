import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useContext, useEffect, useRef } from 'react';
import useApi from '../../api/useApi';
import { translate } from '../../helpers/translate';
import SearchContext from '../../state/context';
import parse from 'html-react-parser';
//import _ from 'lodash';
import '../../css/autocomplete.css';

export default function SearchBox() {
  const {autocomplete, search, excel,fetchSearch} = useApi(); 
  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  const myInput = useRef(null);
  const WAIT_INTERVAL_AUTOCOMPLETE = 300;

// const onOptionChange = (option) =>
// {  
//   console.log(option);
// }


useEffect(() => {  
  const listener = event => {
    //console.log('//dispatch({type:'SET_LOA');
    if (event.target.id ==="autocomlete" && (event.code === "Enter" || event.code === "NumpadEnter" || event.button != null ) ) {  
      let term = event.target.value;
      
      if(!term ||  term.length < 2)// || (term === state.term && !state.results)
      {                
        return;
      }   
     
      console.log('useeffect - searchBox ',term);
      fetchSearch(term).then(res=> {                    
      });
    }
  };
    document.addEventListener("keydown", listener);    

    return () => {
      document.removeEventListener("keydown", listener);         
    };
}, [state]);


const onTermsChange = (e) => {   
  //e.persist();
  if(e == null)
    return;    
  const term = e.target.value ?? e.target.innerText;

  clearTimeout(document.timerID);  
  document.timerID = setTimeout(function(){ insideTimeoutHandler(term)}, WAIT_INTERVAL_AUTOCOMPLETE);
  //console.log('new  timerId is ', document.timerID);
} 

function insideTimeoutHandler(term)
{
    //const term = e.target.value ?? e.target.innerText;
    
   
    if(term ==  null || term.length < 3)
    {
      if(state.autocompleteResults!=[])
      {
        dispatch({type:'SET_AUTOCOMPLETE_RESULTS', payload:{res:[],term}});
      }
    }
    else
    {  
   
      fetchaAutocomplete(term).then(res=> {     
          res = res.map(a=>a.replace(new RegExp(term, 'gi'),term));     
          dispatch({type:'SET_AUTOCOMPLETE_RESULTS', payload:{res,term}});
      } );
    }
}

const fetchaAutocomplete = async (term) => {    
  
  return autocomplete(term);
};




    

function doYouMean()
{
  if(!state.term ||  state.term.length < 2)                 
    return <span></span>;
  

  let heb = translate(state.term);
  if(heb === state.term)
      return <span></span>;

      return   <span className={classes.doYouMeanLable}> האם התכוונת ל<a onClick={(e) => changeTermHeb(e,heb)} className={classes.doYouMeanHref} href='void' > {heb} ?</a></span>

  // if((!state.counters || !state.counters.some(na=>na.count > 0)) && state.term != null)
  // {
  //   return   <span className={classes.doYouMeanLable}> :האם התכוונת ל<a onClick={(e) => changeTerm(e,heb)} className={classes.doYouMeanHref} href='void' > {heb} </a></span>
  // }
}

const changeTermHeb = (event , heb) =>
{
  event.preventDefault();
  dispatch({type:'SET_TERM', payload:heb});

  console.log('changeTermHeb term is:' + state.term );
  fetchSearch(heb).then(res=> {                    
  });
  //debugger;
}



const getRenderedOption = option => {
 var rex = new RegExp(state.term,"ig");
 let strHtml = (option.replace(rex, '<b>'+state.term+'</b>'));
 return parse(`<div>${strHtml}</div>`);
  
}

const clearOptions = e =>   {

  dispatch({type:'SET_TERM', payload:''});  
}

  return (
      <span className='' >
      <Autocomplete className={classes.searchAuto}
              freeSolo              
              renderOption={(option) => getRenderedOption(option)}
              //defaultValue={state.term}
              id="autocomlete"              
              options={state != null  &&  state.autocompleteResults.length  ? state.autocompleteResults.map(a=>a): []}              
              onChange={ (value) => onTermsChange(value)} 
              value={state.term}
              renderInput={(params) => (
              
                <TextField
                className={classes.searchInput}    
               // onChange={_.debounce((e) =>  onTermsChange(e),2000)}    
               onChange={(e)=>onTermsChange(e)}    
                ref={myInput}                 
                  {...params}
                  dir='rtl'                 
                  margin="dense"
                  variant="outlined"
                  InputProps={{                  
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {/* <SearchIcon style={{ color: 'white' }} /> */}
                       {((state.term && state.term.length > 0)|| state.autocompleteResults.length > 0) && <ClearIcon titleAccess="נקה" onClick={(e)=>clearOptions()} style={{ color: 'white' ,cursor:'pointer' }} /> }
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <span className={classes.doYouMean}>{doYouMean()}</span>
          
          </span>       
  );
}

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
  },
  doYouMean:{
    
    margin: '0 50px',
  },
  doYouMeanHref :{
    color:'#fff',
    textDecoration:'underline',  
  '&:hover' :{
    // background:'white',
    //color:'darkblue',
    //fontSize:'1.1em',
    textDecoration:'underline',
    color:'#fff',  
  },
},
  doYouMeanLable:{
    color:'#fff',
},
 
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  '@global': {
    
    '.MuiAutocomplete-option': {   
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    
    },
    '.MuiAutocomplete-option[data-focus="true"]': {       
      background:'rgb(63,81,181,0.08)',    
    },
    
  '.MuiAppBar-colorPrimary': {
  
 } ,
  '.MuiSvgIcon-root' :{
  
  }
  },

  searchInput:{
    overflow: 'hidden',
    whiteSpace: 'nowrap',    
    border:'1px solid white',
    color:'white',
    
  },
  searchAuto:{
    borderRadius: '12px',
    color:'white',    
   /* backgroundColor: fade(theme.palette.common.white, 0.25),*/
    minWidth:'500px'    ,
    margin: '0 50px',
   

  },
  clearIndicator: {
    color: "red"
  },
  
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }
})); 


// document.addEventListener("keydown", listener);
// // document.addEventListener("onclick", listener);
// // document.addEventListener("ondbclick", listener);
// // document.addEventListener("mousedown", listener);

// return () => {
//   document.removeEventListener("keydown", listener);      
//   // document.removeEventListener("onclick", listener);
//   // document.removeEventListener("ondbclick", listener);
//   // document.removeEventListener("mousedown", listener);


