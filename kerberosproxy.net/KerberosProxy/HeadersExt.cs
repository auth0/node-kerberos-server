using Microsoft.Owin;
using System.Net.Http.Headers;
using System.Linq;
using System;

namespace KerberosProxy {

    public static class HeadersExt
    {
        public static void TryCopyTo(this IHeaderDictionary source, HttpHeaders target)
        {
            source.Keys.ToList().ForEach(k =>
            {
                target.TryAddWithoutValidation(k, source[k]);
            });
        }

        public static void TryCopyTo(this HttpHeaders source, IHeaderDictionary target)
        {
            foreach (var item in source)
            {
                try
                {
                    target.AppendValues(item.Key, item.Value.ToArray());
                }
                catch (Exception ex) { }
            }
        }
    }
}
