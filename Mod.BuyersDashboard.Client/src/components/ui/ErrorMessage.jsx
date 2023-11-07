import { makeStyles } from '@material-ui/core/styles';
import SearchContext from '../../state/context';
import React, { useContext, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import e401 from '../../images/401.png'; // with import
import e500 from '../../images/500.png'; // with import


export default function ErrorMessage() {
  const {state} = useContext(SearchContext);
  const classes = useStyles();
  let imgUrl = null;
 useEffect(()=> {
    
 },[state.errorMessage]);

  const getMessage = () => {
  
      switch(state.errorMessage.status){
        case (401):
          imgUrl = e401;
          return "השגיאה לאתר נחסמה עבורך, פנה למנהל המערכת";
        case (500):
          imgUrl = e500;
          return "אריה שגיאה לא צפוייה, פנה למנהל המערכת";
        default:
          return null;
      }
  }

  return (

    <div className={classes.root}> 
   
      {state.errorMessage && getMessage() && 
        <div className={classes.content}>
        <Alert severity="error">{getMessage()}</Alert>
        <img   className={classes.excel} alt="error accured"   src={imgUrl} />
      </div>
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
    padding:'30px'
  }
}));


