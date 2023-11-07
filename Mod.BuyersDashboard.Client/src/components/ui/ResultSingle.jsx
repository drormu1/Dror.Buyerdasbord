import { makeStyles } from '@material-ui/core/styles';
import { VerticalAlignTop } from '@material-ui/icons';
import { AspectRatio } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import parse from 'html-react-parser';
import moment from "moment";
import React, { useContext } from 'react';
import SearchContext from '../../state/context';
import logo from '../../images/LogoSmall1.png'; // with import
import modiIcon from '../../images/modi.jpg'; // with import
import sapIcon from '../../images/sap.jpg'; // with imp
import { translate } from '../../helpers/translate';
import _ from 'lodash';
// CommonJS

export default function ResultSingle(props) {
    
    const classes = useStyles();
    const {state} = useContext(SearchContext);
    
    

    
    const ui = state.configuration && state.configuration.indicesInfo.some(i=>i.name === state.activeIndex)
     ?  state.configuration.indicesInfo.filter(i=>i.name === state.activeIndex)[0].ui 
     : null;

    // function translateField(field)
    // {
    //     if(ui)
    //     {           
    //         return ui.some(f=>f.key === field) ?  ui.find(f=>f.key === field).title : field;
    //     }
    // }

    function getItemsHeader(nodes)
    {
        let html =[];
        for (var i=0;i<nodes.length; i++)
            {
                const currentUI= nodes[i];
                if(currentUI.isHidden)
                {                 
                    continue;
                }
                html.push(<th key={'th_'+currentUI.key}  style={{width:currentUI.width}}>{currentUI.title}</th>)
            }
            return html;
    }
    function getItemsRows(nodes)
    {
        let html =[];
        let numOfItems = nodes.length > 0 ? props.result.fields[nodes[0].key].length : 0;
       
        for (var row=0;row<numOfItems; row++)
            {
                html.push(<tr key={'tr_'+Math.random()+'_'+row}>{getItemRow(row,nodes)}</tr>);
            }
            return html;
    }
    function replaceAll(str,from,to)
    {
        var re = new RegExp(from,'g');
        return str.replace(re,to);
    }
    function removeStyle(makeBigger,event)
    {
        if(makeBigger)
        {         
            event.target.style.whiteSpace=  event.target.style.whiteSpace== "normal" ? "nowrap": "normal";
            //console.log(event.target.style["whiteSpace"]);
        }
    }

    function disableScrollingSingleResult(event) 
    {
        console.log("disableScrollingSingleResult :"+ event.target.parentElement.parentElement.style.height);
        //event.target.style.maxHeight =    event.target.style.maxHeight > 0  ? "nowrap": "normal";
        event.target.parentElement.parentElement.style.maxHeight=event.target.parentElement.parentElement.style.maxHeight == "" ? "140px" : "";
    }
    function  getItemRow(row,nodes)
    {
        let html=[];
        
        for(var column=0;column<nodes.length;column++)
        {         
            
            let val =    (props.result.fields[nodes[column].key][row]) ;   
            // if(nodes[column].isMultiline)
            // {
            //     //val = "תמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפוניתתמורה חודשית חיל הים _ גזרה צפונית";                
            // }       

            try{
                if(state.term.length > 0)
                {
                    let newVal=val;
                    let  stateTerm = _.trim(state.term,'"').trim(state.term);
                  //  console.log('stateTerm :' +stateTerm);

                    let terms = stateTerm.split(' ');
                    terms.forEach(term => {
                        if(term.length >3)
                        {
                        newVal  = replaceAll(newVal,term, '<em>'+term+'</em>');
                        newVal  = replaceAll(newVal,translate(term), '<em>'+translate(term)+'</em>');    
                        }
                    });
                    if(newVal != val)
                    {
                        val = newVal;
                    }
                }
                val=parse(val);
            }
            catch{}
           
           
           if(nodes[column].pipe == 'decimal')
           {
              
               val = val.toLocaleString();
           }
            
            const  isMultiline=nodes[column].isMultiline;

            
            html.push(<td 
              
                onClick={(event)=>removeStyle(isMultiline,event)}
                title={nodes[column].isMultiline ? val : null}  
                style={{width:nodes[column].width}} key={'td_'+nodes[column].key+'_'+row}>{val}
                </td>);
       
        }
        return  html;
    }
   
        
    function   getItemsFields(){
        let html=''; 
        let nodes = ui.filter(f=>f.isArray);
        if(nodes.length > 0)
        {
            html= <table className={classes.tableItems} >
            <thead><tr key="tr_head">           
                {getItemsHeader(nodes)}           
            </tr>
            </thead>
            <tbody>
                {getItemsRows(nodes)}                          
            </tbody>                       
        </table>;
        }
        return html;
    }

    function getFieldOnSameRow()
    {    
      
         let html=[];       
        if(ui &&ui.length> 0 )
        {
            for (var i=0;i<ui.length; i++)
            {
                const currentUI= ui[i];
                if(currentUI.isHidden)
                {
                    continue;
                }
                if(props.result.fields.hasOwnProperty(currentUI.key) && !currentUI.isMultiline && !currentUI.isArray)
                {
                  
                    let value = getValueOrHighlightFromResult(currentUI.key);
                  
                    let linkToId =  props.result.fields[currentUI.linkByFiledValue] != null ? props.result.fields[currentUI.linkByFiledValue][0]: "";                 
                    if(value && value !== '')
                    {                  
                    html.push(getFieldHtml(i,value,currentUI,2,linkToId,props.result));                                     
                    }
                }         
            }
        }
       return html;
    }

    function getValueOrHighlightFromResult(key,justCleanValue)
    {

        if(justCleanValue)
        {
            return props.result.fields[key][0];
        }
        let value = '';
         
        //check if melingo field
     
        if(props.result.highlight && props.result.highlight[key+".melingo"] &&  props.result.highlight[key+".melingo"].length> 0)
        {
                value =  props.result.highlight[key+".melingo"].map(a=>a).join("... ")
        }                
        else if(props.result.highlight && props.result.highlight[key] &&  props.result.highlight[key].length> 0)
        {            
            value =  props.result.highlight[key].map(a=>a).join("... ")
        }
        else 
            value = props.result.fields[key][0];
       
        return value;
        
   
    }
    function getMultiLineFields()
    {
        let html=[];
        if(ui &&ui.length> 0 )
        {
      for (var i=0;i<ui.length; i++)
       {
           const currentUI= ui[i];
           if(props.result.fields.hasOwnProperty(currentUI.key) && currentUI.isMultiline && !currentUI.isArray)
           {
               let value = getValueOrHighlightFromResult(currentUI.key);              
               if(value && value !== '')
               {       
                   var h = getFieldHtml(i,value,currentUI,12);               
                   //console.log(h[0]);                        
                 html.push(<div style={{clear:'both'}}  key={`${currentUI.key}_${i}`} >{h}</div>);                                     
               }
           }         
       }
    }
      return html;
    }

  
    function getIcon(value)
    {
        switch(value){
            case "doc":
            case "docx":
                value = "doc";
                break;
            case "xls":
            case "xlsx":            
            value = "xls";
                break;
            case "csv":
                value = "csv";
                break;

            case "tiff":
            case "tif":
            case "bmp":
            case "png":
            case "jpg":
            case "jpeg":
                value = "tif";
                 break;
            case "pdf":
                value = "pdf";
                break;

            default:
                value = "all";
                break;
        }
        return require("../../images/" + value +".png");
    }
    function getCellStyle(currentUI)
    {
            return  !currentUI.isMultiline ? classes.cell : "" ;
    }
     String.prototype.format =function () {
        var formatted= this;
        for (var i=0;i < arguments.length ; i++)
        {
            var regex = new RegExp ('\\{' + i +'\\}','gi');
            formatted = formatted.replace(regex,arguments[i]);            
        }
        return formatted;
    }
   
    function removeHighligth(value)
    {
        return value.replace('<em><b>','').replace('</b></em>','');
    }
    function getFieldHtml(i,value,currentUI,width,linkToId,result)
    {     
        
      
        //return value;
        let key= `${props.ind}_${currentUI.key}_${i}_${Math.random(100000)}`;        
        var fieldHtml=[]; 
       
        let pipe = null;
           if(currentUI.pipe != null)
           {    
                pipe = currentUI.pipe;
           }  
           if(pipe == null && currentUI.isMultiline)
           {
               pipe = "text";
           }
            switch (pipe) {
                case 'int' :
                    value =  parseInt(value).toLocaleString(navigator.language, { minimumFractionDigits: 0 });
                    break;
                case 'decimal' :
                    
                    value =  parseFloat(value).toLocaleString();
                    break;
                case 'datetime' :
                    value =  moment(value).format("HH:mm:ss DD-MM-YYYY");                     
                        break;
                case 'date' :
                    value =  moment(value).format("DD-MM-YYYY");                     
                        break;
                case 'trueFalse' :
                    value =  value === true ?  "כן" : currentUI.pipe === false ? "לא" : "";                     
                         break;
                case 'link':
                            // value = value.replace('<em>','').replace('</em>','').replace('</b>','').replace('<b>','');
                    try{                        
                    value  = isNaN(value) ? parse(value): value;                
                    }
                    catch(e){
                        console.error(e)
                    }
                    value = <div><a rel="noreferrer"  target="_blank" href={currentUI.linkUrl +linkToId } className={classes.link}>{value}</a></div>;                                        
                    break; 
                case 'items':
                  
                    value=<div>{value}</div>
                    break;

                case 'specialLink':   
                    let modiObjType,sapObjType;
                    let sapLinkToId = linkToId;
                    let modiLink = '';
                    let sapLink = '';
                    if(currentUI.key == "EntityId")
                    {
                       modiObjType = result.fields["Type"][0]=="הזמנה" ? 'PurchaseOrder' : 'Purchasecontract';
                       sapObjType= result.fields["Type"][0]=="הזמנה" ? "/MOD/CA_CALL_TRAN" : "ME33K"; 
                       sapLinkToId = result.fields["Type"][0]=="הזמנה" ? 'PA_TCODE=ME23N;PA_PARID=BES;PA_PARVA='+sapLinkToId : 'RM06E-EVRTN='+sapLinkToId ;
                       sapLink = currentUI.linkUrl[1].format(sapObjType,sapLinkToId);
                    }
                    else if(currentUI.key == "RequirmentNumber")
                    {
                        modiObjType = 'Purchaserequisition';
                        sapLink = currentUI.linkUrl[1].format(sapLinkToId);
                    }                 
                    modiLink = currentUI.linkUrl[0].format(modiObjType,linkToId);
                    //console.log(currentUI.key + ", "  + result.fields["Type"][0] + ": " +sapLink); 
                    
                    //value = removeHighligth(value);
                    value = <>
                                {parse(value)} 
                                <img className={classes.specialImages} title="מודי" src={modiIcon}  onClick={()=>window.open(modiLink,"_blank")}/>
                                <img className={classes.specialImagesSap} title="SAP" src={sapIcon}  onClick={()=>window.open(sapLink,"_blank")}/>                       
                            </>; 
                          
                    //value  = parse(value);                
                    break; 
                    case 'linkSupplier':   
                        
                        if(result.fields["SupplierId"][0] == null)
                        {
                            try{                        
                                value  = isNaN(value) ? parse(value): value;                             
                            }
                            catch{}
                        }
                        else 
                        {
                                        
                            let link = currentUI.linkUrl[0].format(result.fields["SupplierId"][0],result.fields["PurachaseOrganiztionId"][0]);
                            //console.log(link); 
                            value  = isNaN(value) ? parse(value): value;  
                        //value = removeHighligth(value);
                            value = <div><a rel="noreferrer"  target="_blank" href={link} className={classes.link}>{value}</a></div>;            
                        }
                        break;     
                    
                case 'attachment':
                    // value = value.replace('<em>','').replace('</em>','').replace('</b>','').replace('<b>','');
                    try{                        
                     value  = isNaN(value) ? parse(value): value;                
                    }
                 catch(e){
                     console.error(e)
                 }
                    value = <div>
                    
                    {/* <span style={{verticalAlign:'top'}}>{value}</span> */}
                    <div><a rel="noreferrer"  target="_blank" href={currentUI.linkUrl +linkToId }   className={classes.link} style={{verticalAlign:'top'}}>
                        <img  src={getIcon(value)} className={classes.attachmentImg}></img>
                        <span style={{verticalAlign:'top'}}>{value}</span></a></div>
                    </div>;                                        
                    break; 
                default:
                    try{                        
                        value  = isNaN(value) ? parse(value): value;  
                        
                        
                    }
                    catch{}
                    break;
            }
            
        
        
        fieldHtml.push(<div key={key}   title={getValueOrHighlightFromResult(currentUI.key,true)} 
         className={`${classes.field}   ${getCellStyle(currentUI)}`} > 
          <span xs={1} className={classes.label} >{currentUI.title}: </span>         
          <div className={getStyle(currentUI)}>{value}</div>
        </div>)

        return fieldHtml;
    }

 
    function getStyle(currentUI) {
        if (currentUI.cssClass == null || currentUI.cssClass.length === 0)
            return "";
     
        var arr = currentUI.cssClass.split(" ");
        arr = arr.map(cls => classes[cls]);
        if (arr.length == 1)
            return arr[0];

        return arr.join(" ");
    }

    return (
        <div>
            <div style={{maxHeight:'140px',overflowY:'auto',marginTop: '-12px',marginLeft: '10px'}}>               
            {/* borderLeft:'solid 1px lightgray */}
                <div   onClick={(event)=>disableScrollingSingleResult(event)}
                 key={props.result.fields["EntityId"]?.[0] ?? props.result._id +"_ar"} 
                 
                style={{float:'right',marginTop: '0px',marginLeft: '10px' , cursor:'pointer'}}>
                    <AspectRatio></AspectRatio></div>
                <div className={classes.divsOnSameRow}    >
                    {getFieldOnSameRow()}
                    
                </div>
                <div className={classes.multiLine}>{getMultiLineFields()}</div>         
                <div className={classes.multiLine}  style={{overflowY:'hidden'}}  >
                    {getItemsFields()}
                </div>                                                                             
            </div>
            {/* <div style={{clear:'both'}}>
          {props.result && <hr className={classes.hr}/>}
            </div> */}
            </div>
    )
};


const useStyles = makeStyles((theme) => ({
    tableItems:{
       width:'100%',
       border:'rgba(255,255,255,0.1) solid 1px',
       textAlign:'right',
       borderRadius:'8px',
       borderSpacing:'0px',
       fontSize:'0.92em',
       overflow:'hidden',
       disply:'block',
       tableLayout: 'fixed',

       "& th,td":{
        border:'rgba(0,0,0,0.07) solid 1px',
        borderSpacing:'0px',
        textOverflow:'ellipsis',
        overflow:'hidden',
        whiteSpace:'nowrap'

       },
       "& th":{
        //color:'#97c5ef',
        fontWeight:500,
        textAlign:'center',
        background:'#fff'
       }
    },
   
    div:{
        fontFamily: 'sans-serif ',
    },
    link:{
        color:'green'
    },
    specialImages:{
        width:'14px',
        padding: '0px 4px',
        cursor:'pointer'
    },
    specialImagesSap :{
        width:'28px',
        cursor:'pointer'
    },
    attachmentImg:{
        width:'22px',
        padding: '0px 5px'
    },
    divsOnSameRow:
    {
        display:'inline-block',
        float:'right'
    },
    cell:{
        width:'160px',
        display:'inline-block',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflowX: 'hidden',
        marginLeft: '5px',
    },
     hr:
    {
        borderColor:'rgba(0, 0, 0, 0.03)',
    },
   
    label:{
        padding:'1px',
        width: '160px',
        overflow:'hidden',
       // padding:'1px 2px',
        lineHeigth:'10px',
        display: 'flex',
        //background:  'rgba(0, 0, 0, 0.025)',
        fontSize:'0.92em',
        color :'rgb(63,81,181,0.99)',
       // padding: '0px 5px',
      //  margin:'2px',
        borderRadius:'2px'
      },
    
    '@global': {
        // em:{background:'#F8F9CE',
     em:
        {
        fontWeight:'bold',
        color:'blue'
       // background:'yellow'
      
        }
    },
    shortDesc:{
        fontWeight:'600',
        color:'#4075ef'
    },
    title:
    {
        //color:'#0384fc'
    },
    field:{
        fontFamily: 'sans-serif ',
        overflowX: 'hidden',
        textAlign: 'right',
        //fontSize:'0.908em',
        // marginBottom:'5px',
        textOverflow: 'ellipsis',
        overflowY:'hidden',
        // maxHeight:'2.7em',
        color:'rgba(0, 0, 0, 0.99)',
        float:'right',
        maxHeight: '100%',
       //// background:'red'
    },
   
    
    multiLine:{
        fontFamily: 'sans-serif ',
        fontSize:'0.95em',
        width:'98%',
        // marginRight:'20px',
        clear:'both',
        whiteSpace: 'pre-wrap !important',        
    }
   
  }));

