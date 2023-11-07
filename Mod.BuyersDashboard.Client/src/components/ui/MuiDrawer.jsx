import  React ,{useState,  useContext} from 'react'
import {Drawer,Box,IconButton}  from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'
import SearchContext from '../../state/context';
import config from '../../config';
import logo from '../../images/LogoSmall1.png'; // with import
// import DragHandleIcon from '@material-ui/icons/DragHandle';
import Menu from '@material-ui/icons/Menu';
export default function  MuiDrawer() {
  const classes = useStyles();
  const {state, dispatch} = useContext(SearchContext);
  
  const [isDrawerOpen,setIsDrawerOpen] = useState(false);

  const getIframeSrc = ()=> {return `${  import.meta.env.VITE_MODI_URL  + encodeURI(state.term)}`;  }
 console.log(getIframeSrc());
  return (
  <div>
      <img   src={logo} onClick={()=>setIsDrawerOpen(true)} />
        
    <Drawer  anchor='bottom' open={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}>
        <Box className={classes.drawer} >
        <Iframe url={getIframeSrc()}
            position="absolute"
            width="100%"
            id="myId"
            className="myClassname"
            height="95%"
            loading='loading...'
            styles={{height: "95%",overflowY:"scroll"}}/>
        </Box>
    </Drawer>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
    drawer: {
      display: 'flex',
      //color:'rgba(0, 0, 0, 0.54)',
      //backgroundColor:'pink',
      minHeight:'80vh',
      marginBottom :'5px',
      overflowX: 'hidden',
      // 'max-height': '150px',
      overflowY: 'auto',
      borderRadius: '5px',
      textAlign: 'center',
      border : '1px solid rgba(0, 0, 0, 0.14)' ,
     // maxHeight:'120px',
     fontWeight: 'bold',

    },
    '@global': {

        '.MuiDrawer-paperAnchorBottom': {
            'overflowX':'hidden'
        },        
    },


  }));


