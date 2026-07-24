using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using the_identity;

namespace the_identity.Helpers
{
    public static class JsonHelper
    {
        public static JsonElement Parse(string json)
        {
            return JsonDocument.Parse(json).RootElement;
        }
    }

    public static class PiiValidator
    {
        private static readonly string[] RequiredFields =
        {
            "firstname", "lastname", "dob", "address",
            "email", "uni_email", "student_id", "phone"
        };

        public static void Validate(JsonElement root)
        {
            foreach (var field in RequiredFields)
            {
                if (!root.TryGetProperty(field, out _))
                    throw new InvalidDataException($"Missing required field: {field}");
            }
        }
    }

    public static class EncryptionHelper
    {
        public static string EncryptAes192(string plaintext, byte[] key, byte[] iv)
        {
            using var aes = Aes.Create();
            aes.KeySize = 192;
            aes.Key = key;
            aes.IV = iv;

            var encryptor = aes.CreateEncryptor();
            var bytes = Encoding.UTF8.GetBytes(plaintext);
            var encrypted = encryptor.TransformFinalBlock(bytes, 0, bytes.Length);

            return Convert.ToBase64String(encrypted);
        }

        public static string DecryptAes192(string base64Cipher, byte[] key, byte[] iv)
        {
            using var aes = Aes.Create();
            aes.KeySize = 192;
            aes.Key = key;
            aes.IV = iv;

            var decryptor = aes.CreateDecryptor();
            var cipherBytes = Convert.FromBase64String(base64Cipher);
            var decrypted = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

            return Encoding.UTF8.GetString(decrypted);
        }
    }

    public static class ShadowIdHelper
    {
        public static string Generate()
        {
            int baseNumber = RandomNumberGenerator.GetInt32(1000000, 9999999);
            int checksum = baseNumber.ToString().Sum(c => c - '0') % 13;
            return $"S{baseNumber}{checksum}";
        }
    }

    public static class SearchKeyHelper
    {
        public static string? Get(JsonElement root, string key)
        {
            return root.TryGetProperty(key, out var value)
                ? value.GetString()
                : null;
        }
    }

    public static class AuditHelper
    {
        public static void LogDecrypt(string identityId, string auditJson)
        {
            Console.WriteLine($"[AUDIT] Decrypt requested for {identityId}: {auditJson}");
        }
    }
}
