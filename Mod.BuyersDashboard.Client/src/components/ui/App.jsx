import React, { useContext, useReducer } from 'react';
import { Helmet, HelmetProvider } from "react-helmet-async";
import SearchContext, { loadingContext } from '../../state/context';
import SearchReducer, { LoadingReducer } from '../../state/reducer';

import Main from './Main';
import Loading from './Loading';
import { useLocation, BrowserRouter } from 'react-router-dom';


function App() {
  const initialState = useContext(SearchContext);
  const loadingState = useContext(loadingContext);
  // const classes = useStyles();
  const [state, dispatch] = useReducer(SearchReducer, initialState);
  const [loadState, loadingDispatch] = useReducer(LoadingReducer, loadingState);


  // const theme = createMuiTheme({
  //   direction: 'rtl',
  // });

  


  return (
    <HelmetProvider>

      <SearchContext.Provider value={{ state, dispatch }}>
        <loadingContext.Provider value={{ loadingState, loadingDispatch }}>
          <Helmet>
            <title> {state.appTitle}</title>
          </Helmet>

          <BrowserRouter>
            <Main style={{ direction: 'rtl' }}></Main>
          </BrowserRouter>
        </loadingContext.Provider>
      </SearchContext.Provider>

    </HelmetProvider>
  );
}

export default App;


// const useStyles = makeStyles((theme) => ({

// }));



