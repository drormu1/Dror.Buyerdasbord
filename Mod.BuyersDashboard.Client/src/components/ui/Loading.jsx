import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext ,useReducer, useMemo, useEffect, useState } from 'react';
import SearchContext, { loadingContext } from '../../state/context';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import SideMenu from './SideMenu';

import SearchReducer  from '../../state/reducer';
import ErrorMessage from './ErrorMessage';
import Backdrop from '@material-ui/core/Backdrop';



export default function Loading() {
  const classes = useStyles();
 
  //const loadingState = useContext(loadingContext);
  //const [loadState, loadingDispatch] = useReducer(SearchReducer, loadingState);
  
  const {loadingState} = useContext(loadingContext);
  const [loading,setLoading]  = useState(loadingState.loading);
  //const { state} = useContext(SearchContext);

  //workarround
 
  //console.log('Loading is working ',isLoading ?? false)
  // useEffect(() => {
  //   function x (){
  //     setLoading(loadingState.loading)
  //     console.log('in effect Loading' ,loading)
  //   }
  //   x();

  // });

  // const isLoading = useMemo(()=>{      
  //    console.log('in MEMO loading',loadingState.loading)       
  //         return  (loadingState.loading);
  // },[loadingState.loading]);
  var isLoading = document.loading ?? true;
  return (
   
    <div id="loadingbar" className={classes.loadingbar}>      
        <Backdrop className={classes.backdrop} open={isLoading} >          
        </Backdrop> 
      </div>
    );
};
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: 'rgba(0,0,0,0.9)',
    background: 'rgba(0, 0, 0, 0.3)',
    //background: 'pink',
    opacity:0.2,
  },
 
}));


