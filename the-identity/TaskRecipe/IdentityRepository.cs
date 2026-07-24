using Grpc.Core;
using the_identity;
using the_identity.Helpers;

namespace the_identity.TaskRecipe
{
    public interface IIdentityTaskRecipe
    {
        Task SaveStagingAsync(string identityId, string piiJson);
        Task<bool> ExistsAsync(string identityId);
        Task MarkApprovedAsync(string identityId, string approvalJson);
        Task StoreEncryptedAsync(string identityId, string encryptedPii);
        Task StoreShadowIdAsync(string identityId, string shadowId);
        Task<string?> GetEncryptedAsync(string identityId);
        Task<IReadOnlyList<SearchIdentityResult>> SearchAsync(string? hashedFirstname, string? hashedDob);
    }
}

