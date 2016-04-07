using Microsoft.Owin.Hosting;
using Owin;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using System.Collections.Specialized;
using Microsoft.Owin;
using System.Net.Http.Headers;
using System.Diagnostics;

namespace KerberosProxy
{
    class Program
    {
        public static string Backend { get; private set; }
        public static string Header { get; private set; }
        public static string TestUser { get; private set; }

        //args: port backend header secret [test-user]
        //8000 http://localhost:9000 secret-cat fabrikam\john

        static void Main(string[] args)
        {
            Program.Backend = args[1].ToString();
            Program.Header = args[2].ToString();
            Program.TestUser = args.Length == 4 ? args[3].ToString() : null;
            try
            {
                using (WebApp.Start<Startup>("http://*:" + args[0].ToString()))
                {
                    Console.ReadLine();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException.Message);
                System.Environment.Exit(1);
            }
            
        }
    }


    class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpListener listener =
                (HttpListener)app.Properties["System.Net.HttpListener"];

            if (Program.TestUser == null)
            {
                listener.AuthenticationSchemes =
                    AuthenticationSchemes.IntegratedWindowsAuthentication;

                listener.UnsafeConnectionNtlmAuthentication = true;
            }

            app.Run(async context =>
            {

                var url = Program.Backend + context.Request.Uri.PathAndQuery;


                using (HttpClient client = new HttpClient())
                using (var request = new HttpRequestMessage(new HttpMethod(context.Request.Method), url))
                {
                    if (context.Request.Method != "GET")
                    {
                        request.Content = new StreamContent(context.Request.Body);
                    }

                    request.Headers.Add(Program.Header, Program.TestUser ?? context.Request.User.Identity.Name);

                    context.Request.Headers.TryCopyTo(request.Headers);

                    using (HttpResponseMessage response = await client.SendAsync(request))
                    using (HttpContent content = response.Content)
                    {
                        response.Headers.TryCopyTo(context.Response.Headers);
                        context.Response.StatusCode = (int)response.StatusCode;
                        await content.CopyToAsync(context.Response.Body);
                    }
                }
            });
        }
    }

}
