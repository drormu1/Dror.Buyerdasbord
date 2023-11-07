using System;
using System.Configuration;
using System.IO;
using Common.Logging;
using Mod.PurchaseRequest.Files.ELSLoader;

namespace Mod.BuyersDashboard.ElsLoader
{

        public static class FileHelper
        {
            private static readonly string BASEDIR = ConfigurationManager.AppSettings["ArchiveDirectory"];
         private static readonly ILog Log = LogManager.GetCurrentClassLogger();
        private static readonly ILog LogEmail = LogManager.GetLogger("EmailLog");

        public static void InitFolders()
            {
                string[] subFolders = new[] { "Success", "Error", "NotRelevant" };
                foreach (string folder in subFolders)
                {
                    if (!Directory.Exists(Path.Combine(BASEDIR, folder)))
                    {
                        Directory.CreateDirectory(Path.Combine(BASEDIR, folder));
                    }
                }
            }

        public static DateTime ExtractDate(string fileDate)
        {
            DateTime dateTime = new DateTime(
                                int.Parse(fileDate.Substring(0, 4)),
                                int.Parse(fileDate.Substring(4, 2)),
                                int.Parse(fileDate.Substring(6, 2)),
                                int.Parse(fileDate.Substring(8, 2)),
                                int.Parse(fileDate.Substring(10, 2)),
                                int.Parse(fileDate.Substring(12, 2))
                                //,int.Parse(fileDate.Substring(16, 3))
                                );
            return dateTime;
        }
        public static void HandelNotRelevant(string notRelevant, string idocs, FileInfo file, Entity entity)
            {
                if (File.Exists(Path.Combine(notRelevant, file.Name)))
                {
                    File.Delete(Path.Combine(notRelevant, file.Name));
                }
                Log.Trace($"file: {file.Name}   , not relevant organization unit : {entity.PurachaseOrganiztionId}");
                File.Move(Path.Combine(idocs, file.Name), Path.Combine(notRelevant, file.Name));
            }

        public static void HandelSuccess(string success, string idocs, FileInfo file)
            {
                if (File.Exists(Path.Combine(success, file.Name)))
                {
                    File.Delete(Path.Combine(success, file.Name));
                }
                File.Move(Path.Combine(idocs, file.Name), Path.Combine(success, file.Name));
            }

            public static void HandleFailure(string error, string idocs, FileInfo file, Exception e)
            {
                Log.Error($"file: {file.Name}   failed process", e);
                if (File.Exists(Path.Combine(error, file.Name)))
                {
                    File.Delete(Path.Combine(error, file.Name));
                }
            LogEmail.Error($"error on loading file {file.Name} , file move to error folder, {error}", e);
            File.Move(Path.Combine(idocs, file.Name), Path.Combine(error, file.Name));
            }
        }
    }





