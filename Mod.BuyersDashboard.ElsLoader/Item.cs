namespace Mod.PurchaseRequest.Files.ELSLoader
{
    public class Item {
        public string LineId { get; set; }
        public string TextItems { get; internal set; }
        public string ShortDescription { get; internal set; }
        public string MaterialCatalogNumber { get; internal set; }
        public string SupplierCatalogNumber { get; internal set; }
        public string ManufactureCatalogNumber { get; internal set; }
        public string ManufactureId { get; internal set; }

        public string RequirmentLineNumber { get; internal set; }
        public decimal Ammount { get; internal set; }
    }



}

