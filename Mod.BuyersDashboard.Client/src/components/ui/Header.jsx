import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useEffect ,useState} from 'react';
import useApi from '../../api/useApi';
import SearchContext from '../../state/context';
import SearchBox from './SearchBox';
import { useNavigate , useLocation, json  , useSearchParams } from 'react-router-dom';


export default function Header() {
  const {initCall} = useApi(); 
  const [searchParams,setSearchParams] = useSearchParams();

  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  //const [userSso,SetUserSso] = useState('');
  
  const location = useLocation()
  const history = useNavigate ()
  const {fetchSearch} = useApi(); 
  useEffect(() => {
  
   const queryParams = new URLSearchParams(location.search)

    if (queryParams.has('appToken')) {
      const token = queryParams.get('appToken');
      const term = queryParams.get('term');
      
      //imp permitions with roleIds  ,arrive as queryString, this imp is fo MAFAT
      const roleIds = queryParams.get('roleIds');

      localStorage.removeItem("appToken");
      localStorage.removeItem("roleIds");

      localStorage.setItem("appToken",token);
      localStorage.setItem("roleIds",roleIds);

      //dispatch({type:'SET_APP_TOKEN', payload:token});  
      if(term  && term !== "")
      {
        dispatch({type:'SET_TERM', payload:term});  
      }
     
      queryParams.delete('appToken');
      queryParams.delete('term');
      queryParams.delete('roleIds');

      //router v3
      // history.replace({
      //   search: queryParams.toString(),
      // })
        
      if( searchParams.get('appToken'))
      {
        searchParams.delete('appToken');        
      }
      if( searchParams.get('roleIds'))
      {
        searchParams.delete('roleIds');        
      }
      if( searchParams.get('term'))
      {
        searchParams.delete('term');        
      }
      
        setSearchParams(searchParams);
        // fetchSearch(term).then(res=> {                    
        // });
      
    }

},[]);
useEffect(() => {
  //console.log('useeffect - pager');

  if(state.configuration !=null && searchParams !=null && state.results==null && state.term != '')
  {
  fetchSearch().then(res=> {             
  })
  }},

   [searchParams , state.configuration , state.results]
)

  useEffect(() => {  

    //console.log('useeffect - header');
    const fetchData = async () => {     
     
      if(state.configuration === null)
      {             
          return initCall().then(payload => {
            if(payload)
              dispatch({type:'SET_INIT_CONFIGURATION', payload});      
            //console.log('in header '+state.configuration)   ;            
          });          
      }     
    };
 
    fetchData();
  }, [state.configuration]);


  // useEffect(() => {  


  //   const options = {
  //     method : 'GET',
  //     mode:'no-cors',
  //     credentials: 'include',
  //     headers:{
  //       'Accept' :'application/json',
  //       'Content-Type' :'application/json',
  //       //'referrerPolicy':''
       
  //       //'Set-Fetch-Mode':'no-cors',
  //       //'Set-Fetch-Site':'none',
  //       //'Access-Control-Allow-Headers' :'*',
  //       //'Origin' :'http://localhost:5173'  ,
  //      //'Access-Control-Allow-Methods' :'GET,POST,  OPTIONS'
  //     }
  //   };
 
    // const request = new Request(import.meta.env.VITE_SSO_URL, options);
    // fetch(request)
    //   .then((res) => {
    //    // console.log(res);
    //   }).then((res) => {
    //     res.json();
    //   }).then((user) => {
    //     SetUserSso(user);
    //   }).catch((error) => {
    //     console.log(error);
    //   });



 // }, []);

 
  function getLogoSrc() {  
   
    return `http://${import.meta.env.VITE_MODDATA_URL}/Logos/${state.departmentForLogo}_512.png`;
  }
   function  getPersonalImage() {    
 
    //const userId =  userSso != '' ? userSso?.userName : '';  
       console.log('state.loginName '+ state.loginName)
  
    return `http://${import.meta.env.VITE_MODDATA_URL}/Users/${state?.configuration?.user.loginName}.jpg`;
  }

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
        <img src={getLogoSrc()} style={{width:'100px',height:'75px',borderRadius:'3px'}}></img>
          &nbsp;
          <Typography className={classes.title} variant="h6" noWrap>          
             {state.appTitle}
           </Typography>
           
           {state.configuration ?
           <SearchBox className={classes.searchBox} />  :
           null}
                              
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>                                    
            
          <Avatar   alt="" src={getPersonalImage()}  />
          </div>
          {/* <div className={classes.sectionDesktop}>                                    
            <Typography component={'span'} variant={'body2'}>
            &nbsp;{state.configuration && state.configuration.user.displayName }
           </Typography>                            
          </div>
            */}
          
        </Toolbar>
      </AppBar>  
      <div className={classes.toolbar}></div>
    </div>
    
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
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      marginTop: '-15px'
    },
  },
  searchBox :{
    width:'400px'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  '@global': {
    '.MuiFormControl-marginDense':{
      marginTop: '20px'
  },
  
  '.MuiAppBar-colorPrimary': {
     backgroundColor:  'cornflowerblue !important' 
  } ,
  '.MuiOutlinedInput-root' :{
      borderRadius :'0px',
      border : 0,
      color:'black',
      backgroundColor:'white'
  },

  '.MuiAutocomplete-input':{
    color:'black',
    backgroundColor:'white'
  },
  '.MuiInputBase-root.Mui-focused':{
      borderColor : 'pink', 
  }
  }
})); 
 


