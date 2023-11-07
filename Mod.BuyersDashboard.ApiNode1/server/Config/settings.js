//oncontenxt remember :   selectedAggregation, current oage

module.exports = class Settings {

    constructor() { }

    //static indecis =this.db.indecis;


    static specialAggregations = [];
    //user:{username:'UUUU', displayname:'דרור מוסאי'}

    static general =
        [
            {
                "name": "entities-mashan",
                "rolesRequired": false,
                "title": "תוצאות",
                "aggregation": ["Type","PurchaseRequestGroup"],

                "searchFields": ["EntityId", "Type", "PurchaseRequestGroup", "SupplierId",                  
                    "Title.melingo", "SpecialConditions.melingo","SupplierCatalogNumber",
                    "SupplierName", "TotalAmmountBeforeVat", "RequirmentNumber",
                    "Items.TextItems.melingo","Items.ShortDescription.melingo",
                    "Items.MaterialCatalogNumber" ,"Items.ManufactureCatalogNumber" ,"Items.ManufactureId"
                    ],

                "returnFields": ["EntityId", "Type", "PurchaseRequestGroup","SupplierId", "SpecialConditions", "Title","SupplierCatalogNumber",
                                 "SupplierName", "TotalAmmountBeforeVat", "RequirmentNumber","PurachaseOrganiztionId","Currency",
                                "Items.LineId","Items.ShortDescription","Items.TextItems","Items.MaterialCatalogNumber" ,
                                "Items.ManufactureCatalogNumber" ,"Items.ManufactureId","Items.Ammount"
            ],

                "ui": [
                    
                    {
                        "key": "EntityId",
                        "title": "מזהה",
                        "linkByFiledValue": "EntityId",
                        "linkUrl": ["http://sp16p-natav/_layouts/GenericLink.aspx?ObjType={0}&ObjId={1}",
                                    "http://rimon.mod.int:8101/irj/servlet/prt/portal/prtroot/com.sap.portal.appintegrator.sap.bwc.Transaction?System=PRD&TCode={0}&GuiType=WinGui&OkCode=/0&Technique=SSF&ApplicationParameter={1}"],
                       
                        "isMultiline": false,
                        "pipe": "specialLink",
                        "order": 2
                    },
                    {
                        "key": "PurchaseRequestGroup",
                        "title": "קבוצת רכש",                                               
                        "isMultiline": false,
                        "order": 3,
                        "aggregationFilter" : true

                    },                                                         
                    {
                        "key": "SupplierName",
                        "title": "שם ספק",
                        "isMultiline": false,
                        "pipe" : "linkSupplier",
                        "linkUrl" : ["http://rimon.mod.int:8101/irj/servlet/prt/portal/prtroot/com.sap.portal.appintegrator.sap.bwc.Transaction?System=PRD&TCode=MK03&GuiType=WinGui&OkCode=/0&Technique=SSF&ApplicationParameter=RF02K-LIFNR={0};RF02K-D0110=X;RF02K-EKORG={1}"]
                    },
                    {
                        "key": "SupplierCatalogNumber",
                        "title": "מקט ספק",                       
                      
                        "isMultiline": false,  
                      
                      
                    },
                    {
                        "key": "SupplierId",
                        "title": "מספר ספק",
                        "isMultiline": false,                        
                    },
                    {
                        "key": "PurachaseOrganiztionId",
                        "title":"ארגון רכש",
                        "isMultiline": false,
                        "isHidden" : true
                    },
                    
                    {
                        "key": "RequirmentNumber",
                        "title": "מס דרישה",                       
                        "linkByFiledValue": "RequirmentNumber",
                        "linkUrl": ["http://sp16p-natav/_layouts/GenericLink.aspx?ObjType={0}&ObjId={1}",
                                    "http://rimon.mod.int:8101/irj/servlet/prt/portal/prtroot/com.sap.portal.appintegrator.sap.bwc.Transaction?System=PRD&TCode=/MOD/CA_CALL_TRAN&GuiType=WinGui&OkCode=/0&Technique=SSF&ApplicationParameter=PA_TCODE=ME53N;PA_PARID=BAN;PA_PARVA={0}"],
                        "isMultiline": false,
                        "pipe" : "specialLink",
                    },
                                     
                    {
                        "key": "Type",
                        "title": "סוג",
                        "isMultiline": false,                       
                        "order": 1,
                    },
                    {
                        "key": "TotalAmmountBeforeVat",
                        "title": "סהכ כולל מעמ",
                        "isMultiline": false,
                        "pipe": "decimal",
                        
                    },
                    {
                        "key": "Currency",
                        "title" :"מטבע",
                        
                        
                    },
                    {
                        "key": "UpdatedAt",
                        "title": "תאריך עדכון",
                        "pipe": "datetime"


                    }, 
                    {
                        "key": "Items.LineId",
                        "title": "שורה",                                              
                        "width":"5%",                       
                        "isArray" :true,
                        
                    },  
                    {
                        "key": "Items.ShortDescription",
                        "title": "תאור פריט",                                              
                        "width":"20%",                       
                        "isArray" :true,
                        
                    },              
                    {
                        "key": "Items.MaterialCatalogNumber",
                        "title": "מקט חומר",                       
                        "width":"10%",                       
                        "isArray" :true
                    }, 
                    {
                        "key": "Items.ManufactureCatalogNumber",
                        "title": "מקט יצרן",                       
                        "width":"10%",                       
                        "isArray" :true
                                            
                    }, 
                    {
                        "key": "Items.ManufactureId",
                        "title": "מס יצרן",                       
                        "width":"10%",                       
                        "isArray" :true
                   
                    }, 
                    {
                        "key": "Items.Ammount",
                        "title": "סכום כולל מעמ ",                       
                        "width":"7%",                       
                        "isArray" :true,
                        "pipe": "decimal",
                        
                   
                    }, 
                    {
                        "key": "Items.TextItems",
                        "title": "טקסט פריט",                       
                        "width":"38%",   
                        "isMultiline": true,                                         
                        "isArray" :true
                    }, 
                    {
                        "key": "Title",
                        "title": "כותרת",                       
                        "isMultiline": true,
                        
                    },
                    {
                        "key": "SpecialConditions",
                        "title": "תנאים מיוחדים",
                        "isMultiline": true,
                    }
                   
                  
                ]
            }
        ]
}




