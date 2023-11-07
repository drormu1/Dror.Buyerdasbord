//oncontenxt remember :   selectedAggregation, current oage

module.exports = class Settings {
    
    constructor(){}
    
    //static indecis =this.db.indecis;
      
    
    static specialAggregations = [
        {
        index:'requests',
        field:'Amount',
        title:'סכום ',
        type: 'number',
        labels:['החל מ','עד ל'],     
        order:2,  
      },
      {
        index:'requests',
        field:'RoundOfSignaturesCreatedAt',   
        type: 'date',
        title:'ת.יצירת סבב חתימות',
        labels:['החל מ','עד ל'],   
        order:3,      
      }, 
      {
        index:'clarifications',
        field:'SentAt',   
        type: 'date',
        title:'נפתח ב',
        labels:['החל מ','עד ל'],       
        order:3,      

      }, 
      {
        index:'clarifications',
        field:'AnsweredAt',   
        type: 'date',
        title:'נענה ב:',
        labels:['החל מ','עד ל'],       
        order:4,      

      }];
    //user:{username:'UUUU', displayname:'דרור מוסאי'}

    static general =        
            [{ 
                    "name":"requests",
                    "rolesRequired":true,
                    "title":"תיקים",
                    "aggregation":["SectionId","Section","Department","StatusName","RequiringUnitName","SecurityClearanceName","SupplierNameInRequestFrame","KnowledgeAreaName","FeatureName","RequestTypeName","MopImplementationDirected","AddingContent","IsConsultants","ContainsMatatBudget","ModOwner","CommonFinancing","KnowledgeCenter","IsKnowledgeCenterCreated","IsHgOrder","GTG","Talmi","CancelledRequest","HasEMF","HasChangedEdition","Urgent","IsGreenLight","UpdatedAt","ActualRoleName","ActualRoleDuration","ExternalDataSourceName","ClarificationSecurityOfficer"],
                    "searchFields": ["RequestId^2","DisplayNumber^50","Description^5","ProjectCode","ProjectName","SectionId","Section","Department","StatusName","RequiringUnitName","PurchaseMethodsName","FundCenter","Fund","CI","StartAt","EndAt","SecurityClearanceName","SupplierCodeInRequestFrame^5","SupplierNameInRequestFrame","SupplierCodeInRequestTaskLines","SupplierNameInRequestTaskLines","KnowledgeAreaName","FeatureName","RequestTypeName","ErpOrder","ErpDemand","Amount","EMF","MopImplementationDirected","AddingContent","IsConsultants","ContainsMatatBudget","ModOwner","CommonFinancing","KnowledgeCenter","KnowledgeDetails","IsKnowledgeCenterCreated","IsHgOrder","GTG","Talmi","CancelledRequest","HasEMF","HasChangedEdition","Urgent","IsGreenLight","UpdatedAt","ActualRoleName","ActualRoleDuration","ExternalDataSourceName","ClarificationSecurityOfficer","FundedProgram","InternalOrder"],
                    "returnFields": ["RequestId","DisplayNumber","Description","ProjectCode","ProjectName","Section","Department","StatusName","RequiringUnitName","PurchaseMethodsName","FundCenter","Fund","CI","StartAt","EndAt","SecurityClearanceName","SupplierCodeInRequestFrame","SupplierNameInRequestFrame","SupplierCodeInRequestTaskLines","SupplierNameInRequestTaskLines","KnowledgeAreaName","FeatureName","RequestTypeName","ErpOrder","ErpDemand","Amount","EMF","MopImplementationDirected","AddingContent","IsConsultants","ContainsMatatBudget","ModOwner","CommonFinancing","KnowledgeCenter","KnowledgeDetails","IsKnowledgeCenterCreated","IsHgOrder","GTG","Talmi","CancelledRequest","HasEMF","HasChangedEdition","Urgent","IsGreenLight","UpdatedAt","ActualRoleName","ActualRoleDuration","RoundOfSignaturesCreatedAt","ChangeAmount","ExternalDataSourceName","ClarificationSecurityOfficer","FundedProgram","InternalOrder"],
                    "ui":[
                            
                        {
                            "key" : "RequestId",
                            "title" : "מזהה",
                            "linkByFiledValue":"RequestId",
                            "linkUrl":"http://purchaserequestsqa/he/Requests/Display?RequestId=",
                            "cssClass":"bold",
                            "isMultiline":false,
                            "pipe":"link"		
                        },
                        {
                            "key" : "DisplayNumber",
                            "title" : "מספר תיק",
                            "linkByFiledValue":"RequestId",
                            "linkUrl":"http://purchaserequestsqa/he/Requests/Display?RequestId=",
                            "cssClass":"bold",
                            "isMultiline":false,
                            "pipe":"link"	,
                            "order":1,      

                        },
                        {
                            "key" : "Description",
                            "title" : "תאור",
                            "cssClass":"bold",
                            "isMultiline":true,
                                
                        },
                        {
                            "key" : "SupplierNameInRequestFrame",
                            "title" : "שם ספק במסגרת",
                            "cssClass":"bold",
                            "isMultiline":false,
                                
                        },
                        {
                            "key" : "StatusName",
                            "title" : "סטאטוס"	
                        },
                        {
                            "key" : "ProjectCode",
                            "title" : "קוד פקוייקט",
                        },
                        {
                            "key" : "ProjectName",
                            "title" : "שם פרוייקט"	
                        },

                        {
                            "key" : "SectionId",
                            "title" : "קוד ענף"	
                        },
                        
                        {
                            "key" : "Section",
                            "title" : "ענף"	
                        },

                        {                
                        "key" : "Department",
                            "title" : "מחלקה"
                        },                      
                        {
                            "key" : "RequiringUnitName",
                            "title" : "יחידה דורשת"	
                        },
                        {
                            "key" : "PurchaseMethodsName",
                            "title" : "שיטת התקשרות"	
                        },
                       
                      
                        {
                            "key" : "RoundOfSignaturesCreatedAt",
                            "title" : "תאריך יצירת סבב",                            
                            "pipe":"datetime"
                        },
                        {
                            "key" : "FundCenter",
                            "title" : "מרכז מימון"	
                        },
                        {
                            "key" : "Fund",
                            "title" : "מימון"	
                        },
                        {
                            "key" : "CI",
                            "title" : "CI"	
                        },
                        {
                            "key" : "StartAt",
                            "title" : "ת. התחלה"	,                            
                            "pipe":"datetime"
                        },
                        {
                            "key" : "EndAt",
                            "title" : "ת. סיום"	,                            
                            "pipe":"datetime"
                        },
                        {
                            "key" : "SecurityClearanceName",
                            "title" : "סיווג בטחוני",
                            "order":1
                            
                        },
                        {
                            "key" : "SupplierCodeInRequestFrame",
                            "title" : "מס ספק במסגרת"	
                        },

                        {
                            "key" : "SupplierCodeInRequestTaskLines",
                            "title" : "מס ספק בשורת משימה"	
                        },
                        {
                            "key" : "KnowledgeAreaName",
                            "title" : "מרכז ידע"	
                        },
                        
                        {
                            "key" : "FeatureName",
                            "title" : "תכונות נוספות"	
                        },
                        {
                            "key" : "RequestTypeName",
                            "title" : "סוג תיק"	
                        },{
                            "key" : "ErpOrder",
                            "title" : "מס' הזמנת רכש ב-ERP"	
                        },
                        {
                            "key" : "ErpDemand",
                            "title" : "מס' דרישה ב-ERP"	
                        },
                        {
                            "key" : "Amount",
                            "title" : "סכום הזמנה",                            
                            "pipe":"decimal"
                        },{
                            "key" : "ChangeAmount",
                            "title" : "סכום שינוי",
                            "pipe":"number"
                        },{
                            "key" : "EMF",
                            "title" : "EMF"	
                        },{
                            "key" : "MopImplementationDirected",
                            "title" : "תיק מימוש תמורות GTG"	
                        },
                      
                        {
                            "key" : "AddingContent",
                            "title" : "תוספת תכולה"	
                        },{
                            "key" : "IsConsultants",
                            "title" : "מפתח יחיד "	
                        },{
                            "key" : "ContainsMatatBudget",
                            "title" : "מכיל תקציב מת''ט"	
                        },{
                            "key" : "ModOwner",
                            "title" : "רכוש משהב''ט"	
                        },{
                            "key" : "CommonFinancing",
                            "title" : "ממון משותף"	
                        },{
                            "key" : "KnowledgeCenter",
                            "title" : "מוקד ידע"	
                        },
                        
                        {
                            "key" : "KnowledgeDetails",
                            "title" : "פרטי מרכז ידע"	
                        },{
                            "key" : "IsKnowledgeCenterCreated",
                            "title" : "האם קיים מרכז ידע "	
                        },{
                            "key" : "IsHgOrder",
                            "title" : "מה''ג"	
                        },{
                            "key" : "GTG",
                            "title" : "האם GTG "	
                        },{
                            "key" : "Talmi",
                            "title" : "תלמ''י"	
                        },{
                            "key" : "CancelledRequest",
                            "title" : "תיק מבוטל"	
                        },
                        {
                            "key" : "HasEMF",
                            "title" : "האם יש EMF "	
                        },{
                            "key" : "HasChangedEdition",
                            "title" : "מהדורת שינוי"	
                        },{
                            "key" : "Urgent",
                            "title" : "האם רכש בהול "	
                        },{
                            "key" : "IsGreenLight",
                            "title" : "האם אור ירוק "	
                        },{
                            "key" : "UpdatedAt",
                            "title" : "עודכן בתאריך"	,                            
                            "pipe":"datetime"
                        },{
                            "key" : "ActualRoleName",
                            "title" : "נמצא כרגע אצל"	
                        },                                                               
                        {
                            "key" : "ActualRoleDuration",
                            "title" : "זמן בתפקיד נוכחי"	
                        },{
                            "key" : "ExternalDataSourceName",
                            "title" : "מקור מידע חיצוני"	
                        },{
                            "key" : "ClarificationSecurityOfficer",
                            "title" : "האם ברור קבט "	
                        },{
                            "key" : "FundedProgram",
                            "title" : "תוטכנית מימון"	
                        },{
                            "key" : "InternalOrder",
                            "title" : "הזמנה פנימית"	
                        },

                               
                         ]
            },
            {
                "name":"frames",
                "rolesRequired":false,
                "title":"מסגרות",
                "searchFields": ["Id","FrameTypeId","PurchasingOrg","Description","ExemptionExpirationDate","SupplierId","Amount","Balance","CommiteeId","WillingnessDate"],
                "aggregation":["PurchasingOrg"],                    
                "returnFields": ["Id","FrameTypeId","PurchasingOrg","Description","ExemptionExpirationDate","SupplierId","Amount","Balance","CommiteeId","WillingnessDate"],
            "ui":[
                    
                {
                    "key" : "Id",
                    "title" :"מזהה",               
                },
                    {
                        "key" : "FrameTypeId",
                        "title" : "סוג מסגרת",    
                    },
                    {
                        "key" : "PurchasingOrg",
                        "title" : "ארגון רכש",    
                    },
                    
                    {
                        "key" : "ExemptionExpirationDate",
                        "title" : "תוקף פטור",   
                        "pipe" : "datetime" 
                    },
                    {
                        "key" : "SupplierId",
                        "title" : "ספק",    
                    },
                    {
                        "key" : "Amount",
                        "title" : "סכום",                            
                            "pipe":"decimal"
                    },
                    {
                        "key" : "Balance",
                        "title" : "מאזן",    
                    },
                    {
                        "key" : "CommiteeId",
                        "title" : "מס' ועדה",    
                    },
                    {
                        "key" : "ExcemptionTypeId",
                        "title" : "מאפיין פטור",    
                    },
                   
                    {
                        "key" : "WillingnessDate",
                        "title" : "תאריך נכונות",
                        "pipe" : "datetime"
                        
                    }
                    
                ]
            },
            {
                "name":"clarifications",
                "rolesRequired":true,
                "title":"ברורים",
                "searchFields": ["RequestId","EntityId","EventType","SentByRoleId","SentAt","AnsweredByUserDisplayName","AnsweredAt","SentToRoleId","Description","Answer"],
                "aggregation":["SentByRoleId","SentToRoleId","EventType"],                    
                "returnFields": ["RequestId","EntityId","EventType","SentByRoleId","SentAt","AnsweredAt","SentToRoleId","AnsweredByUserDisplayName","Description","Answer"],
            "ui":[
                    
                {
                    "key" : "EntityId",
                    "title" :"מזהה",     
                    "linkByFiledValue":"EntityId",
                    "linkUrl":"http://purchaserequestsqa/he/Clarifications/Display?ClarificationId=",
                    "cssClass":"bold",
                    "isMultiline":false,    
                    "pipe":"link"     , 
                },
                    {
                        "key" : "RequestId",
                        "title" : "מספר תיק",  
                        "linkByFiledValue":"RequestId",
                        "linkUrl":"http://purchaserequestsqa/he/Requests/Display?RequestId=",
                        "pipe":"link",
                        
                    },
                    {
                        "key" : "EventType",
                        "title" : "סוג הבירור",  
                        "order":2,  
                    },
                                    
                   
                    
                    
                    {
                        "key" : "SentByRoleId",
                        "title" : "נשלח על ידי",   
                        "order":1,
                        
                    },
                    {
                        "key" : "SentToRoleId",
                        "title" : "נשלח אל",  
                        "order":3,  
                    },
                    {
                        "key" : "SentAt",
                        "title" : "נשלח ב",  
                        "pipe" : "datetime"  
                    },
                    {
                        "key" : "AnsweredAt",
                        "title" : "נענה ב",                            
                        "pipe" : "datetime"
                    },
                    {
                        "key" : "AnsweredByUserDisplayName",
                        "title" : "נענה על ידי",                                                    
                    },
                    
                    {
                        "key" : "Description",
                        "title" : "שאלה", 
                        "isMultiline":true,

                    },
                    {
                        "key" : "Answer",
                        "title" : "תשובה", 
                        "isMultiline":true,

                    }
                   
                    
                ]
            },

                    
        ];

};




