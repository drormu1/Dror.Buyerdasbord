//oncontenxt remember :   selectedAggregation, current oage

module.exports = class Settings {
    
    constructor(){}
    
    //static indecis =this.db.indecis;
      
    
    static general =        
            [{ 
                    "name":"orders",
                    "rolesRequired":false,
                    "title":"הזמנות",
                    "aggregation":["sales_channel", "salesman.name"  ,"status","_id","total_amount"],
                    "searchFields": ["sales_channel^5", "salesman.name"  ,"status","_id"],
                    "returnFields": ["RequestId","DisplayNumber","Description","ProjectCode","ProjectName","SectionId","Section","Department","StatusName","RequiringUnitName","PurchaseMethodsName","CreatedBy","RoundOfSignaturesCreatedAt","FundCenter","Fund","CI","StartAt","EndAt","SecurityClearanceName","SupplierCodeInRequestFrame","SupplierNameInRequestFrame","SupplierCodeInRequestTaskLines","SupplierNameInRequestTaskLines","KnowledgeAreaName","FeatureName","RequestTypeName","ErpOrder","ErpDemand","Amount","ChangeAmount","EMF","MopImplementationDirected","AddingContent","IsConsultants","ContainsMatatBudget","ModOwner","CommonFinancing","KnowledgeCenter","KnowledgeDetails","IsKnowledgeCenterCreated","IsHgOrder","GTG","Talmi","CancelledRequest","HasEMF","HasChangedEdition","Urgent","IsGreenLight","UpdatedAt","ActualRoleName","ActualRoleDuration","ExternalDataSourceName","ClarificationSecurityOfficer","FundedProgram","InternalOrder"],
                    "ui":[
                            
                            {
                                "key" : "sales_channel",
                                "title" : "ערוץ מכירה",
                                "linkByFiledValue":"_id",
                                "linkUrl":"http:..google.com/?tv=",
                                "cssClass":"bold",
                                "isMultiline":false,
                                "pipe":"link"
                                
                            },
                            {
                                "key":"salesman.name",
                                "title" : "שם המוכר",
                                "linkByFiledValue":"_id",
                                "linkUrl":"http:..google.com/?tv=",
                                "cssClass":"bold",
                                "isMultiline":false,
                                "pipe":"link"

                            },
                            {
                                "key":"purchased_at",
                                "title" :"תאריך ההזמנה",                                
                                "cssClass":"bold",
                                "isMultiline":true,
                                "pipe":"datetime"
                            }  ,
                            {
                                "key":"status",
                                "title" :"מצב הזמנה",
                                "linkByFiledValue":"_id",
                                "linkUrl":"http:..google.com/?tv=",
                                "cssClass":"bold",
                                "isMultiline":false,                               
                                
                            },
                            {
                                "key":"total_amount",
                                "title" :"סכום",
                                
                                "cssClass":"bold",
                                "isMultiline":true,
                                "pipe":"decimal"
                            }                            
                        ]
                    },
                    {
                        "name":"companies",
                        "title":"חברות",
                        "aggregation":["category_code"],
                        "searchFields": ["permalink^5", "name"  ,"twitter_username","tag_list","email_address","overview","category_code"],
                        "returnFields": ["permalink", "name"  ,"twitter_username","tag_list","email_address","overview","category_code"],
                        "ui":[
                                
                                {
                                    "key":"sales_channel",
                                    "title" : "ערוץ מכירה",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },
                                {
                                    "key":"salenames_channel",
                                    "title" : "שם",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },
                                {
                                    "key":"permalink",
                                    "title" :"קישור",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },
                                {
                                    "key" :"twitter_username",
                                    "title" : "טוויטר",                                    
                                    "cssClass":"bold",
                                    "isMultiline":false,                                   
                                },
                                {
                                    "key":"email_address",
                                    "title" : "מייל",                                   
                                    "cssClass":"bold",
                                    "isMultiline":true,
                                    
                                },
                                {
                                    "key":"category_code",
                                    "title" : "מזהה",                     
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                   
                                }
                                
                            ]
                        },
                        {
                            "name":"books",
                            "title":"ספרים",
                            "aggregation":["status","authors","categories"],
                            "searchFields": ["title^5", "isbn"  ,"pageCount","shortDescription","longDescription","status","authors"],
                            "returnFields": ["publishedDate", "thumbnailUrl"  ,"shortDescription","longDescription","status","authors","categories"],
                            "ui":[
                                    
                                    {
                                        "key" : "tilte",
                                        "title" : "שם הספר",
                                        "linkByFiledValue":"_id",
                                        "linkUrl":"http:..google.com/?tv=",
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        "pipe":"link"
                                    },
                                    {
                                        "key" : "thumbnailUrl",
                                        "title" : "קישור",
                                        "linkByFiledValue":"_id",
                                        "linkUrl":"http:..google.com/?tv=",
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                        "pipe":"link"
                                    },
                                    {
                                        "key" : "authors",
                                        "title" : "מחבר",
                                        "linkByFiledValue":"_id",
                                        "linkUrl":"http:..google.com/?tv=",
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        "pipe":"link"
                                    },
                                    {
                                        "key" : "categories",
                                        "title" :"קטגורייה",
                                        
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        
                                    },
                                    {
                                        "key" : "title",
                                        "title" : "תאור",
                                     
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                       
                                    },
                                    {
                                        "key" : "isbn",
                                        "title" : "מק''ט",
                                        
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                       
                                    },
                                    {
                                        "key" : "pageCount",
                                        "title" : "כמות דפים",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        
                                    },
                                    {
                                        "key" : "shortDescription",
                                        "title" : "תאור ארוך",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                        
                                    },
                                    {
                                        "key" : "longDescription",
                                        "title" : "תאור ארוך",
                                      
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                        
                                    },
                                    {
                                        "key" : "status",
                                        "title" : "מצב הוצאה",
                                      
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                        
                                    }
                                    
                                ]
                        },
                        {
                            "name":"restaurant",
                            "title":"מסעדות",
                            
                            "aggregation":["outcode","postcode","rating", "type_of_food"],
                            "searchFields": ["address","address line 2","name^5","outcode","postcode","rating", "type_of_food"],
                            "returnFields": ["address","address line 2","name","outcode","postcode","rating", "type_of_food"],
                            "ui":[
                                    
                                    {
                                        "key" : "name",
                                        "title" : "שם מסעדה",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        "pipe":"link"
                                    },
                                    {
                                        "key" : "outcode",
                                        "title" : "קוד עסקי",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                       
                                    },
                                    {
                                        "key" : "postcode",
                                        "title" :"מיקוד",
                                        
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                        
                                    },
                                    {
                                        "key" : "rating",
                                        "title" : "דירוג",
                                      
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                       
                                    },
                                    {
                                        "key" : "type_of_food",
                                        "title" : "סוג מזון",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                        
                                    },
                                    {
                                        "key" : "address",
                                        "title" : "כתובת",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":false,
                                       
                                    },
                                    {
                                        "key" : "address line 2",
                                        "title" : "כתובת לדואר",
                                       
                                        "cssClass":"bold",
                                        "isMultiline":true,
                                       
                                    }
                                    
                                ]
                        },

                    
                    {
                        "name":"products",
                        "title":"מוצרים",
                        "searchFields": ["name^5", "description"  ,"tags","_id"],
                        "aggregation":["name", "tags"],
                    
                        "returnFields": ["name", "description"  ,"tags","_id",],
                    "ui":[                            
                            {
                                "key" : "status",
                                "title" : "מוצר",                                
                               
                                "cssClass":"bold",
                                "isMultiline":false,
                                
                            },
                            {
                                "key" : "tags",
                                "title" : "תגיות",
                               
                                "cssClass":"bold",
                                "isMultiline":false,
                                
                            },                            
                            {
                                "key" : "description",
                                "title" : "תאור",
                               
                                "cssClass":"bold",
                                "isMultiline":true,
                                
                            },
                            {
                                "title" :"_id",
                                "linkByFiledValue":"_id",
                                "linkUrl":"http:..google.com/?tv=",
                                "cssClass":"bold",
                                "isMultiline":false,
                                "pipe":"link"
                            }
                            
                        ]
                    },  
                    {
                        "name":"todos",
                        "title":"משימות",
                        "searchFields": ["title","id","compelted"],
                        "aggregation":["completed"],                    
                        "returnFields": ["title","id","completed"],
                    "ui":[
                            
                        {
                            "key" : "id",
                            "title" :"מזהה",
                            "linkByFiledValue":"_id",
                            "linkUrl":"http:..google.com/?tv=",
                            "cssClass":"bold",
                            "isMultiline":false,
                            "pipe":"link"
                        },
                            {
                                "key" : "completed",
                                "title" : "האם בוצע",
                               
                                "cssClass":"bold",
                                "isMultiline":false,
                                "pipe":"trueFalse"
                                
                            },
                           
                            {
                                "key" : "title",
                                "title" : "תאור",
                               
                                "cssClass":"bold",
                                "isMultiline":true,
                                
                            }
                            
                        ]
                    },
                    {
                        "name":"youtubes",
                        "title":"יו טיוב",
                        "searchFields": ["title^5", "description"  ,"location","name","id","_id"],
                        "aggregation":["title" ,"name"],
                        "searchFields": ["title", "description"  ,"location","name","id","_id"],
                        "returnFields": ["title", "description"  ,"location","name","id","_id"],
                        "ui":[                                                        
                            
                            {
                                    "key" : "name",
                                    "title" :"שם הכותר",
                                     "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },
                               
                                {
                                    "key" : "title",
                                    "title" : "תאור קצר",
                                  
                                    "cssClass":"bold",
                                    "isMultiline":false,                                  
                                },
                                {
                                    "key":"id",
                                    "title" : "מזהה פנימי",
                                 
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    
                                },                                
                                {
                                    "key" : "_id",
                                    "title" :"מזהה",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },                                
                                {
                                    "key" : "location",
                                    "title" :"מיקום",                                   
                                    "cssClass":"bold",
                                    "isMultiline":false,                                    
                                }                                
                               
                            
                            
                            ]
                    },
                    {
                        "name":"employees",
                        "title":"עובדים",
                        "aggregation":["eyeColor", "company"],
                        "searchFields": ["name^5", "eyeColor"  ,"age","tags","address","company","_id"],                       
                        "returnFields": ["name", "eyeColor"  ,"age","tags","address","company","_id"],
                        "ui":[                                                                                
                                {
                                    "key" : "name",
                                    "title" :"שם העובד",
                                     "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },
                                
                                {
                                    "key" : "eyeColor",
                                    "title" : "עיניים",
                                   
                                    "cssClass":"bold",
                                    "isMultiline":false,                                  
                                },                                                              
                                {
                                    "key" : "_id",
                                    "title" :"מזהה",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                },                                
                                {
                                    "key" : "age",
                                    "title" :"גיל",
                                   
                                    "cssClass":"bold",
                                    "isMultiline":false,                                    
                                },                                
                                {
                                    "key" : "address",
                                    "title" :"כתובת",
                                   
                                    "cssClass":"bold",
                                    "isMultiline":false,                                    
                                } ,                                
                                {
                                    "key" : "company",
                                    "title" :"חברה",
                                    "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false, 
                                    "pipe":"link"                                   
                                }  ,
                                {
                                    "key" : "status",
                                    "title" :"מצב",
                                    
                                    "cssClass":"bold",
                                    "isMultiline":false,                                    
                                }                                                                                                                               
                            ]
                    },
                    {
                        "name":"comments",
                        "title":"תגובות",
                        "searchFields": ["name^5", "email"  ,"body","_id"],
                        "returnFields": ["name^5", "email"  ,"body","_id"],
                        "aggregation":["name", "email"],
                        "ui":[                                                       
                                {
                                    "key" : "name",
                                    "title" :"שם",
                                     "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                   
                                },                                
                                {
                                    "key" : "email",
                                    "title" : "דואר אלקטרוני",
                                  
                                    "cssClass":"bold",
                                    "isMultiline":false,                                  
                                },                                                              
                                {
                                    "key" : "body",
                                    "title" :"תוכן",
                                  
                                    "cssClass":"bold",
                                    "isMultiline":true,
                                    
                                },                                                              
                            
                            ]
                    },
                    {
                        "name":"friends",
                        "title":"חברים",
                        "searchFields": ["name^5", "gender"  ,"birthDate"],
                        "returnFields": ["name^5", "gender"  ,"birthDate"],
                        "aggregation":["gender"],
                        "ui":[                                                       
                                {
                                    "key" : "name",
                                    "title" :"שם",
                                     "linkByFiledValue":"_id",
                                    "linkUrl":"http:..google.com/?tv=",
                                    "cssClass":"bold",
                                    "isMultiline":false,
                                    "pipe":"link"
                                   
                                },                                
                                {
                                    "key" : "gender",
                                    "title" : "מין",
                                  
                                    "cssClass":"bold",
                                    "isMultiline":false,                                  
                                },                                                              
                                {
                                    "key" : "birthDate",
                                    "title" :"תאריך לידה",
                                    "pipe" : "date",
                                    "cssClass":"bold",
                                    "isMultiline":true,
                                    
                                },                                                              
                            
                            ]
                    },
                    
        ];

};




