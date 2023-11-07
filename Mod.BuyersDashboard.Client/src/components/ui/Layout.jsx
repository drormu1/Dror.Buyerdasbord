import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext , useMemo } from 'react';
import SearchContext   from '../../state/context';
import Content from './Content';
import Loading from './Loading';
import SelectedAggregations from './SelectedAggregations';
import Footer from './Footer';
import Header from './Header';
import SideMenu from './SideMenu';
import MuiDrawer from './MuiDrawer';
import Testbox from './Testbox';

import ErrorMessage from './ErrorMessage';




export default function Layout() {
  const classes = useStyles();
  const { state} = useContext(SearchContext);

  
  const getSideMenu = useMemo(()=>{      
          
            return  (<SideMenu></SideMenu>);
    },[state.activeIndex,state.selectedAggregations]);

    const getContnet = useMemo(()=>{      
      
          return  (<Content></Content>);
  },[state.results]);
    
    
    const getTestBox = useMemo(()=>{      
         
          return  (<Testbox></Testbox>);
  },[]);

    // const getContent = useMemo(()=>{
    //   console.log('in getContent')
    //   return(<Content></Content>);
    // },[4]);
    
    
  
  
  return (
    <>   
    <Loading />
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={12}>     
         <Header />      
      </Grid>
      { state.configuration?
       
       state.results && state.results.hits?.length>0?               
        <Grid item xs={12}>
            <Grid item xs={12} className={classes.modiIcon}  style={{position: 'sticky',zIndex:'100',top:'95px'}}>
          <MuiDrawer></MuiDrawer>
      </Grid>
      <Grid container spacing={2} style={{ 'minHeight': '90vh' , marginTop : '40px' }}>
            <Grid item xs={2} style={{ 'maxWidth': '13%' }}>
            
           {getSideMenu}
         
            </Grid>
            <Grid item xs={10}>
            {getContnet}
            {/* {getTestBox} */}
            </Grid>
          </Grid>
        </Grid> 
        :
        <Grid container spacing={2} style={{ 'minHeight': '90vh' }}>
         
            <br></br>
                {state.firstSearchDone && <div style={{
                  color:'rgb(0,0,0,0.75)',
                  marginTop:'-30vh',
                  marginRight: '20%',
                  width: '100%',      
                  fontSize: '1.05em'
                }}> 
                       
               אופסס, החיפוש שלך - <b>{state.term} </b> לא תאם אף מסמך או רשומה.
               
               <br/>
                <ul> הצעות:
                  <li>לוודא שכול המילים מאוייתות נכון</li>
                  <li>לנסות מילות מפתח אחרות</li>
                  <li>לנסות מילות מפתח כלליות יותר</li>
                </ul>    
                {state.selectedAggregations?.length>0 ? 

                <div>
                  <br></br>
                  שים לב כי הסננים הבאים מופעלים:
                  <SelectedAggregations/> 
                </div>   : null         
                }
                </div>
                  
              }
        </Grid>
        : <div style={{minHeight : '90vh'}}>
           {state.errorMessage ? <ErrorMessage/> : null}
        </div>
        
      }
      
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
    </>
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
    opacity:0.2,
  },

  modiIcon :{
  background: 'darkcyan',
  marginTop: '20px',  
  width: '150px',
  margin:'1px',
  borderRadius:'5px',
  cursor: 'pointer'
 
  },

  '@global': {
    '.MuiGrid-container': {
      minHeight: '100%'
    }
  }
 
}));





