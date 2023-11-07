using System.Linq;

namespace Mod.BuyersDashboard.ElsLoader
{
    public static class  Extenstions
    {
        public static string CleanText(this string text)
        {
            text = text.Replace("@?@", " ");
            text = string.Join("=", text.Split('=').Where(a => a != ""));
            text = string.Join("-", text.Split('-').Where(a => a != ""));
            text = string.Join("_", text.Split('_').Where(a => a != ""));
            text = string.Join("*", text.Split('*').Where(a => a != ""));
            text = text.Replace("<", "<<");
            text = text.Replace(">",">>");
            return text;
        }

        public static string RemoveQuationsMark(this string text)
        {
          
            return text.Trim('"').Trim().Replace("\"\"", "\"");
        }

      
    }



}

