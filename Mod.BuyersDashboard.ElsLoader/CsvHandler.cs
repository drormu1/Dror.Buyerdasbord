using Common.Logging;
using Mod.PurchaseRequest.Files.ELSLoader;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Mod.BuyersDashboard.ElsLoader
{
    public static class CsvHandler
    {       
        private static readonly ILog Log = LogManager.GetCurrentClassLogger();
     

        public static Entity BuildOrderFormCSV(string line,int lineId, Counters counters)
        {
            string lastStep = "";
            Entity entity = new Entity();
            entity.Items = new List<Item>();
          
            string sep = "\t";
            string[] cells = line.Split(sep.ToCharArray());
            try
            {
                Console.WriteLine(lineId);
                if (cells.Length > 35)
                {
                    counters.Defected += 1;

                    if (!counters.DefectedIds.Any(a => a == cells[2])/* && cells[2].StartsWith("8")*/)
                    {
                        counters.DefectedIds.Add(cells[2]);
                    }
                    return null;

                }
                if ( cells[34] == "X")
                {
                    counters.Deleted += 1;
                    Console.WriteLine(lineId + ": is deleted");
                    return null;
                }
                entity.UpdatedAt = DateTime.ParseExact(cells[9], "dd/MM/yyyy", null);
                lastStep = "updatedAt";

                lastStep = CsvHandler.HandleCsvLine(entity, cells);
          
                return entity;
            }
            catch (Exception e)
            {
                
                    counters.Defected += 1;
                    if (cells.Length > 2 && !counters.DefectedIds.Any(a => a == cells[2]) && cells[2].StartsWith("444"))
                    {
                        counters.DefectedIds.Add(cells[2]);
                        Log.ErrorFormat($"lineId {lineId},line: {cells[2]} , {e.Message} ");
                    }
                
                return null;
            }
        }

        public static string HandleCsvLine(Entity entity, string[] cells)
        {
            string lastStep = "";
            entity.EntityId = cells[2].Trim('"').Trim();
            lastStep = "id";

            entity.Type = cells[0] == "F" ? "הזמנה" : "הסכם";
            lastStep = "type";

            //string prId = cells[5].Trim() ?? "";
            //string pdaAme = cells[6].Trim() ?? "";
            entity.PurchaseRequestGroup = cells[6].RemoveQuationsMark() ?? "";
//            entity.PurchaseRequestGroup = prId + " - " + pdaAme;
            lastStep = "purchaseRequestGroup";

            entity.PurachaseOrganiztionId =  cells[5].RemoveQuationsMark() ?? "";
            lastStep = "PurachaseOrganiztionId";

            entity.SpecialConditions = cells[11].CleanText().RemoveQuationsMark() ?? "";
            lastStep = "specialConditions";


            entity.Title = cells[10].CleanText().RemoveQuationsMark() ?? "";
            lastStep = "title";

            entity.RequirmentNumber = cells[3].RemoveQuationsMark() ?? "";

            string currency = cells[33].RemoveQuationsMark() ?? "";
            currency = currency == "ILS" ? new CultureInfo("he-IL").NumberFormat.CurrencySymbol : currency == "USD" ? "$" : currency;
            entity.Currency = currency;
            lastStep = "currency";
           

            entity.SupplierName = cells[8].RemoveQuationsMark() ?? "";
            lastStep = "supplierName";

            entity.SupplierId = cells[7].RemoveQuationsMark() ?? "";
            lastStep = "SupplierId";


        

            // item 
            Item item = new Item();
            item.LineId = cells[1].RemoveQuationsMark() ?? "";

            item.ShortDescription = cells[24].RemoveQuationsMark().CleanText() ?? "";
            lastStep = "shortDescription";


            item.TextItems = cells[26].RemoveQuationsMark().CleanText() ?? "";
            lastStep = "textItems";

            item.MaterialCatalogNumber = cells[25].RemoveQuationsMark().CleanText() ?? "";
            lastStep = "materialCatalogNumber";



            item.SupplierCatalogNumber = cells[29].RemoveQuationsMark() ?? "";
            lastStep = "supplierCatalogNumber";

            //
            item.ManufactureCatalogNumber = cells[30].RemoveQuationsMark() ?? "";
            lastStep = "manufactureCatalogNumber";





            //
            item.ManufactureId = cells[31].RemoveQuationsMark() ?? "";
            lastStep = "manufactureId";

            item.Ammount = decimal.Parse(cells[32].RemoveQuationsMark());                        
            lastStep ="itemAmmount";


            item.RequirmentLineNumber = cells[4].RemoveQuationsMark() ?? "";
            lastStep = "requirmentLineNumber";

            entity.Items = new List<Item>();
            entity.Items.Add(item);

            return lastStep;
        }

    }
}




//0 Type,
//1 POSEX,
//2 EntityId,
//3 RequirmentNumber,
//4 RequirmentLineNumber,
//5 PurachaseOrganiztionId,
//6 PurchaseRequestGroup,
//7 SupplierId,
//8 SupplierName,
//9 UpdatedAt,
//10 Title,
//11 SpecialConditions,
//12 E1EDKT2 - 03–TDLINE,
//13 E1EDKT2 - 04–TDLINE,
//14 E1EDKT2 - 06–TDLINE,
//15 E1EDKT2 - 07 - TDLINE,
//16 E1EDKT2 - 08 - TDLINE,
//17 E1EDKT2 - 09 - TDLINE,
//18 E1EDKT2 - 10 - TDLINE,
//19 E1EDKT2 - 11 - TDLINE,
//20 E1EDKT2 - 13 - TDLINE,
//21 E1EDKT2 - 14 - TDLINE,
//22 E1EDKT2 - 15 - TDLINE,
//23 E1EDKT2 - 16 - TDLINE,
//24 ShortDescription,
//25 MaterialCatalogNumber,
//26 TextItems,
//27 E1EDPT1 - 04 - TDLINE,
//28 E1EDPT1 - 10 - TDLINE,
//29 SupplierCatalogNumber,
//30 ManufactureCatalogNumber,
//31 ManufactureId,
//32 TotalAmmountBeforeVat
//33 Currency
//34 DELETED