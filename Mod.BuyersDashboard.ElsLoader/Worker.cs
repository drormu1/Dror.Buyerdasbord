using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Common.Logging;
using Mod.PurchaseRequest.Files.ELSLoader;
using Newtonsoft.Json;

namespace Mod.BuyersDashboard.ElsLoader
{
    public partial class Worker
    {
        //private static readonly ILog Log = LogManager.GetCurrentClassLogger();

        private static readonly string Files = ConfigurationManager.AppSettings["Files"];
        private static readonly ILog Log = LogManager.GetCurrentClassLogger();
        protected static readonly ILog LogEmail = LogManager.GetLogger("EmailLog");
        private static readonly string SOURCES_XMLS = ConfigurationManager.AppSettings["SourcesXml"];
        private static readonly string BASEDIR = ConfigurationManager.AppSettings["ArchiveDirectory"];
        private static readonly string _index = ConfigurationManager.AppSettings["index"];


        public void Start()
        {

            //int hoursBefor = int.Parse(ConfigurationManager.AppSettings["HourBefore"]);
            //Log.Trace($"hoursBefor {hoursBefor}");
            //DateTime sinceDate = DateTime.Now.AddHours(-1 * hoursBefor);
            //Log.Trace($"now processing {_index}");
            FileHelper.InitFolders();

            HandleXmls(_index);

            HandleCsv(_index);

            //Log.Trace($"finish iterate  requests");
        }

        private void HandleCsv(string index)
        {
            Counters counters = new Counters();
            string success = Path.Combine(BASEDIR, "Success");
            string error = Path.Combine(BASEDIR, "Error");
            string notRelevant = Path.Combine(BASEDIR, "NotRelevant");

            //string working = Path.Combine(BASEDIR, "Working");
            string idocs = SOURCES_XMLS;
            var idocsDirectory = new DirectoryInfo(idocs);
            //var workingDirectory = new DirectoryInfo(working);

            var idocsCsv = idocsDirectory.GetFiles("*.txt", SearchOption.TopDirectoryOnly)
                          //.Where(a => a.Name.Contains("order"))
                          //order by timestamp
                          //.OrderBy(f => f.Name.Split(' ')[1].Replace("-", string.Empty))//.Substring(0,16))
                          .ToList().Take(30);
          
            int fileNum = 0;
          
            foreach (var file in idocsCsv)
            {
                counters = new Counters();
                fileNum++;
                Log.Trace($"process file number {fileNum}-from {idocsCsv.Count()}, {file.Name}");
            
                string lastStep = "read csv";

                try
                {
                   

                    string filePath = Path.Combine(idocs, file.Name);
                    string[] lines = File.ReadAllLines(filePath, Encoding.UTF8);
                    counters.TotalLines = lines.Length;
                    Dictionary<string, Entity> entities = new Dictionary<string, Entity>();
                  
                    int lineId = 1;
                 
                    foreach (string line in lines.Skip(1))
                    {
                        lineId++;

                        var entity = new Entity();
                        entity = CsvHandler.BuildOrderFormCSV(line, lineId,counters);
                        if(entity == null)
                        {
                            continue;
                        }

                        if (entities.Any(e => e.Key == entity.EntityId))
                        {
                            entities.First(e => e.Key == entity.EntityId).Value.Items.Add(entity.Items.First());
                        }
                        else
                        {
                            entities.Add(entity.EntityId, entity);
                        }
                        
                    }
                    Log.Trace($"total lines {counters.TotalLines}, defected {counters.Defected}, deleted { counters.Deleted } , entities {entities.Count},  in  {file.Name} csv");
                    File.WriteAllLines(@"d:\\logs\\"+file.Name,counters.DefectedIds);
                    foreach (Entity entity in entities.Values)
                    {
                        entity.TotalAmmountBeforeVat = entity.Items.Sum(a => a.Ammount);
                    }



                 
                    //.Where(e=>e.EntityId == "4441003020")
                    //foreach (Entity entity in entities.Values)
                    //{

                    IterateBulk(entities.Values.ToList(), index, fileNum.ToString(), 1000);
                                   
                    FileHelper.HandelSuccess(success, idocs, file);
                    Console.WriteLine($"going to sleep {fileNum}");
                    System.Threading.Thread.Sleep(1000 * 60 * 1);
                }
                catch (Exception e)
                {
                  
                    FileHelper.HandleFailure(error, idocs, file, e);
                }
            }

         

        }




        private static void HandleXmls(string index)
        {
            string success = Path.Combine(BASEDIR, "Success");
            string error = Path.Combine(BASEDIR, "Error");
            string notRelevant = Path.Combine(BASEDIR, "NotRelevant");

            //string working = Path.Combine(BASEDIR, "Working");
            string idocs = SOURCES_XMLS;
            var idocsDirectory = new DirectoryInfo(idocs);
            //var workingDirectory = new DirectoryInfo(working);

            var idocsXmls = idocsDirectory.GetFiles("*Orders_*.xml", SearchOption.TopDirectoryOnly)
                          //.Where(a => a.Name.Contains("order"))
                          //order by timestamp
                          .OrderBy(f => f.Name.Split('_')[4].Replace("-", string.Empty))//.Substring(0,16))
                          .ToList().Take(1000);




            int fileNum = 0;
            int linesCountTotal = 0;
            foreach (var file in idocsXmls)
            {
                List<Entity> entities = new List<Entity>();
                Log.Trace($"process file {fileNum} - from {idocsXmls.Count()}, files is {file.Name}");
                System.Threading.Thread.Sleep(100);
                string lastStep = "read xml";
                bool isLegalIdoc = true;

                try
                {
                    fileNum++;
                    string filePath = Path.Combine(idocs, file.Name);
                    XDocument xml = XDocument.Load(filePath);
                    var entity = new Entity();
                    entity = BuildOrderFormXml(filePath, xml);
                    if (isLegalIdoc)
                    {

                        //not relevant organization unit
                        if (entity.PurachaseOrganiztionId != "0001")
                        {
                            FileHelper.HandelNotRelevant(notRelevant, idocs, file, entity);
                            isLegalIdoc = false;
                        }
                        else if (entity != null)
                        {
                            entities.Add(entity);
                        }
                    }

                    if (isLegalIdoc && entities.Any())
                    {

                        IterateBulk(entities, index, entities.First().EntityId, 51);

                        FileHelper.HandelSuccess (success, idocs, file);
                    }
                }
                catch (Exception e)
                {
                    FileHelper.HandleFailure(error, idocs, file, e);
                }
            }
            if (linesCountTotal > 0)
            {
                Log.Trace($"{linesCountTotal} - lines Count Total in this xml");
            }
        }


        private static int IterateBulk<T>(List<T> lines, string index, string entityId, int counterBulk = 1000)
        {


            //Log.Trace($"now processing {index}, found {lines.Count}");

            if (!lines.Any())
            {
                Console.WriteLine("no lines found to index");
                return 0;
            }
            int page = 0;
            List<T> objs = null;
            for (int i = 0; i < lines.Count; i++)
            {
                if (i == 0)
                    continue;
                if (i % counterBulk == 0)
                {
                    objs = lines.Skip(counterBulk * page).Take(i - counterBulk * page).ToList();
                    HttpResponseMessage httpResponseMessage1 = OpertionsToNode(index, objs, entityId.ToString()).GetAwaiter().GetResult();
                    if (!httpResponseMessage1.IsSuccessStatusCode)
                    {
                        throw new Exception(httpResponseMessage1.ReasonPhrase);
                    }
                    if(objs.Count > 50)
                        System.Threading.Thread.Sleep(10000);
                    else
                        System.Threading.Thread.Sleep(200);
                    Console.WriteLine($"index {index}, till now {i } lines");
                    page++;
                }

                // Console.WriteLine(i);
            }

            objs = lines.Skip(counterBulk * page).Take(lines.Count - counterBulk * page).ToList();
            HttpResponseMessage httpResponseMessage = OpertionsToNode(index, objs, entityId.ToString()).GetAwaiter().GetResult();
            if (!httpResponseMessage.IsSuccessStatusCode)
            {
                throw new Exception(httpResponseMessage.ReasonPhrase);
            }
            // Log.Trace($"index till now {lines.Count } lines");
            // Log.Trace("end " + index);
            //Log.Trace("=============================================================");
            return page;
        }
        private async static Task<HttpResponseMessage> OpertionsToNode<T>(string indexName, List<T> objects, string entityId)
        {
            string nodeApiUrl = ConfigurationManager.AppSettings["NodeApiUrl"];
            Uri uri = new Uri($"{nodeApiUrl}/loadbulk");
            HttpClient client = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true });
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            JsonSerializerSettings setings = new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore, MaxDepth = 1 };

            var json = JsonConvert.SerializeObject(new { index = indexName, rows = objects, entityId }, setings);

            json = json.Replace("True", "כן");
            json = json.Replace("False", "לא");



            var stringContent = new StringContent(json, Encoding.UTF8, "application/json");
           // Console.WriteLine(uri);
           // Console.WriteLine(json);
            Console.WriteLine("*******************");
            HttpResponseMessage response = await client.PostAsync(uri, stringContent);
            response.EnsureSuccessStatusCode();

            // return URI of the created resource.
            return response;
        }



        static Entity BuildOrderFormXml(string file , XDocument xml)
        {
            string lastStep = "";
            Entity entity = new Entity();
            entity.Items = new List<Item>();
            try
            {
                int linesCount = xml.Descendants("E1EDP01").Count();
                Log.Trace($"{linesCount} - lines in this xml");
                string fileDate = Path.GetFileName(file).Split('_')[4] + Path.GetFileName(file).Split('_')[5];
                entity.UpdatedAt = FileHelper.ExtractDate (fileDate);
                lastStep = "updatedAt";
                lastStep = HandleEntity(entity, xml);

                for (int lineNumber = 0; lineNumber < linesCount; lineNumber++)
                {                   
                    entity.Items.Add(HandleLine(xml, lineNumber));
                }
                entity.TotalAmmountBeforeVat = entity.Items.Sum(a => a.Ammount);
              
                return entity;
            }
            catch (Exception e)
            {
               
                Log.Error("last step = " + lastStep, e);
                return null;
            }
        }

       

        private static Item HandleLine(XDocument xml,int lineNumber)
        {
            XElement xElement = xml.Descendants("E1EDP01").ElementAt(lineNumber);
            Item item = new Item();

            item.LineId = xElement.Element("POSEX").Value;

            item.ShortDescription = string.Join(" ",
                     xElement.Descendants("E1EDP19").
                    Where(x => (string)x.Element("QUALF") == "001").
                    Select(x => (string)x.Element("KTEXT") + ",")).TrimEnd(',').CleanText() ?? "";
            string lastStep = "shortDescription";


            item.TextItems = string.Join(" ",
                xElement.Descendants("E1EDPT1").
                Where(x => (string)x.Element("TDID") == "F01").
                Descendants("E1EDPT2").
                Select(x => ((string)x.Element("TDLINE"))?.Trim())).CleanText() ?? "";
            lastStep = "textItems";


            //entity.MaterialCatalogNumber = xElement.Descendants("E1EDP19").
            //  Select(x => (string)x.Element("MATNR")).FirstOrDefault()?.Trim() ?? "";

            item.MaterialCatalogNumber = xElement.Element("IDTNR")?.Value.Trim() ?? "";
            lastStep = "materialCatalogNumber";



            item.SupplierCatalogNumber = xElement.Descendants("E1EDP19").
                 Where(x => (string)x.Element("QUALF") == "002").
                 Select(x => (string)x.Element("IDTNR")).FirstOrDefault()?.Trim() ?? "";
            lastStep = "supplierCatalogNumber";

            //
            item.ManufactureCatalogNumber = xElement.Descendants("Z1CIEKPODB").
                Select(x => (string)x.Element("ZZMFCTMT")).FirstOrDefault()?.Trim() ?? "";
            lastStep = "manufactureCatalogNumber";


            //
            item.ManufactureId = xElement.Descendants("Z1CIEKPODB").
                Select(x => (string)x.Element("ZZMFCT")).FirstOrDefault()?.Trim() ?? "";
            item.ManufactureId = item.ManufactureId;
            lastStep = "manufactureId";


            item.Ammount = xElement.
              Descendants("E1EDP05").
              Where(x => (string)x.Element("KOTXT") == "מחיר כולל מע\"מ").
              Select(x => ((decimal)x.Element("BETRG"))).FirstOrDefault();

            
            lastStep = "itemAmmount";


            item.RequirmentLineNumber = xElement.Descendants("Z1EDP01").
              Select(x => (string)x.Element("BNFPO")).
              FirstOrDefault()?.Trim() ?? "";
            lastStep = "requirmentLineNumber";

            return item;



        }

        private static string HandleEntity(Entity entity, XDocument xml)
        {
            string lastStep = "";
            entity.EntityId = xml.Descendants("E1EDK01")
                .Select(x => (string)x.Element("BELNR"))
                .FirstOrDefault()?.Trim();
            lastStep = "id";


            string type = xml.Descendants("Z1EDK01")
               .Select(x => (string)x.Element("BSTYP"))
               .FirstOrDefault()?.Trim();
            if (type == "F")
            {
                entity.Type = "הזמנה";
            }
            else if (type == "K")
            {
                entity.Type = "הסכם";
            }

            lastStep = "type";



            string prId = xml.Descendants("E1EDK14").
                Where(x => (string)x.Element("QUALF") == "009").
                Select(x => (string)x.Element("ORGID")).FirstOrDefault()?.Trim() ?? "";




            string pdaAme = xml.Descendants("E1EDKA1").
                Where(x => (string)x.Element("PARVW") == "AG").
                Select(x => (string)x.Element("BNAME")).FirstOrDefault()?.Trim() ?? "";

            entity.PurchaseRequestGroup = prId + " - " + pdaAme;
            lastStep = "purchaseRequestGroup";

            string purachaseOrganiztionId = xml.Descendants("E1EDK14").
            Where(x => (string)x.Element("QUALF") == "014").
            Select(x => (string)x.Element("ORGID")).FirstOrDefault()?.Trim() ?? "";
            entity.PurachaseOrganiztionId = purachaseOrganiztionId;
            lastStep = "PurachaseOrganiztionId";



            entity.SpecialConditions = string.Join(" ",
               xml.Descendants("E1EDKT1").
               Where(x => (string)x.Element("TDID") == "F02").
               Descendants("E1EDKT2").
               Select(x => ((string)x.Element("TDLINE"))?.Trim())).CleanText() ?? "";
            lastStep = "specialConditions";


            entity.Title = String.Join(" ",
              xml.Descendants("E1EDKT1").
              Where(x => (string)x.Element("TDID") == "F01").
              Descendants("E1EDKT2").
              Select(x => ((string)x.Element("TDLINE"))?.Trim())).CleanText();
            lastStep = "title";

            entity.RequirmentNumber = xml.Descendants("Z1EDP01").
        Select(x => (string)x.Element("BANFN")).
        FirstOrDefault()?.Trim() ?? "";
            lastStep = "requirmentNumber";

            string currency = xml.Descendants("E1EDP05")
            .Select(x => (string)x.Element("KOEIN"))
            .FirstOrDefault()?.Trim() ?? "";

            currency = currency == "ILS" ? new CultureInfo("he-IL").NumberFormat.CurrencySymbol : currency == "USD" ? "$" : currency;
            entity.Currency = currency;
            lastStep = "currency";


            entity.SupplierName = xml.Descendants("E1EDKA1").
                 Where(x => (string)x.Element("PARVW") == "LF").
                 Select(x => (string)x.Element("NAME1")).FirstOrDefault()?.Trim() ?? "";
            lastStep = "supplierName";

            entity.SupplierId = xml.Descendants("E1EDK01").
                 Select(x => (string)x.Element("RECIPNT_NO")).FirstOrDefault()?.Trim() ?? "";
            lastStep = "SupplierId";


            //decimal ammount = xml.Descendants("E1EDP01").
            //    //GroupBy(x=>(string)x.Element("POSEX")).
            //    Descendants("E1EDP05").
            //    Where(x => (string)x.Element("KSCHL") == "ZPB1").
            //    Select(x => ((decimal)x.Element("BETRG"))).FirstOrDefault();
            //if (ammount > 0)
            //{
            //    entity.TotalAmmountBeforeVat = 
            //        //currency + " " + (ammount.ToString("N").EndsWith(".00") ? ammount.ToString("N0") : ammount.ToString("N"));
            //}
            //lastStep = "totalAmmountBeforeVat";

            return lastStep;
        }
    }



}

