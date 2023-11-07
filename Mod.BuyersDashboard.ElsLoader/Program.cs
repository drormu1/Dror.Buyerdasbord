using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mod.BuyersDashboard.ElsLoader
{
    class Program
    {
        static void Main(string[] args)
        {
          
      
            Console.WriteLine("start");
            Worker worker = new Worker();
            worker.Start();
            Console.WriteLine("finish");
        }
    }
}


