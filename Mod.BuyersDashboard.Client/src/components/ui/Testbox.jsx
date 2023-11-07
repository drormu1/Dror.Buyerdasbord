import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import parse from 'html-react-parser';
import React, { useContext, useEffect ,useState,useMemo} from 'react';

import SearchContext from '../../state/context';
import Switch from '@material-ui/core/Switch';
import useSettingsHelper from '../../api/useSettingsHelper';
import SpecialAggregation from './SpecialAggregation';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

export default function Testbox() {
  
    const {state, dispatch} = useContext(SearchContext);
    const {activeIndex} = state;
    const d=  new Date().valueOf()
    // useEffect(() => { 
    //     console.log('Testbox effect');
  
    // }, []);

    // useEffect(() => { 
    //     console.log('use effect side menu');
    // },[state.term]);
   
  


    console.log('Testbox is working: ',  d);




    return (
        <div>
            [{d}] 
            {state.activeIndex}
        </div>
    )
};




