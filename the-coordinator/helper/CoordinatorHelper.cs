using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using the_coordinator;

namespace the_coordinator.Helpers
{
    public static class JsonHelper
    {
        public static JsonElement Parse(string json)
        {
            return JsonDocument.Parse(json).RootElement;
        }
    }
}