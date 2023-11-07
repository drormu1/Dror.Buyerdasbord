using Mod.BuyersDashboard.ElsLoader;
using System;
using System.Collections.Generic;

namespace Mod.PurchaseRequest.Files.ELSLoader
{
    public class Entity : Iautocomplete
    {
        public Entity()
        {

        }

      
      

        public string EntityId { get; set; }
       // public string PurchseRequestGroupId { get; set; }
       
        public DateTime UpdatedAt { get; set; }
       
        //public Nullable<System.DateTime> RoundOfSignaturesCreatedAt { get; set; }

        
        public List<Item> Items { get; set; }     
        public string Type { get; internal set; }
       
        public string PurchaseRequestGroup { get; internal set; }
        public string PurachaseOrganiztionId { get; internal set; }
        public string Title { get; internal set; }
        public string SpecialConditions { get; internal set; }
    
       
        public string SupplierName { get; internal set; }
        public string SupplierId { get; internal set; }
        public decimal TotalAmmountBeforeVat { get; internal set; }

        public string Currency { get; internal set; }

        //public string Currency { get; internal set; }
        public string RequirmentNumber { get; internal set; }
    
        //public int _id;

        public string autocomplete
        {

            get
            {
                var s = string.IsNullOrWhiteSpace(Title) ?  SpecialConditions : Title;
                if (s.Length > 60) s = s.Substring(0, 60).Replace('@', ' ');
                return s;
            }
        }


    }



}

