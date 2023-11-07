import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    text: {      
      backgroundColor:'rgba(0, 0, 0, 0.1)',
      padding:3,
      color: 'rgba(0, 0, 0, 0.35)',
      // position : 'absolute',
      // bottom : 0,
      width:'100%'
      
      
    },
   
  }));

export default function Footer(){
    const classes = useStyles();
    const tag = `מערכת ${import.meta.env.VITE_CLIENT_NAME} גרסה ${import.meta.env.VITE_VERSION} פותחה ע"י אגף מל"ן - משהב"ט 2023`;
    return (
      <div>
        <AppBar position="static" variant="elevation" color="default" className={classes.appBar}>
            <Typography className={classes.text} variant="body2" align="center" >
            {tag}
            </Typography>
        </AppBar>
      </div>
    )
}

