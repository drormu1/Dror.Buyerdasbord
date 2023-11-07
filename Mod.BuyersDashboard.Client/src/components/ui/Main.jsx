import Backdrop from '@material-ui/core/Backdrop';
import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useContext,useReducer,useEffect } from 'react';
import SearchContext from '../../state/context';
import SearchReducer from '../../state/reducer';
import Layout from './Layout';


export default function Main() {
  const classes = useStyles();
  const initialState = useContext(SearchContext);
  const [state, dispatch] = useReducer(SearchReducer, initialState);
  

  

  const theme = createTheme({
    typography: {
      fontFamily: [
        'sans-serif',
        'Rubik',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  return (
    <>
      
      <div className="App">
      <ThemeProvider theme={theme}>
      <Layout></Layout>
     </ThemeProvider>
        
      </div>
      
    </>
  );
};


const useStyles = makeStyles((theme) => ({
  body:{
    background:'red'
  },

}));


