using Grpc.Core;
using the_identity;
using Microsoft.Extensions.Logging;
using the_identity.Helpers;
using System.Security.Cryptography;

namespace the_identity.Services;

public class IdentityService : global::the_identity.IdentityService.IdentityServiceBase
{

    private readonly ILogger<IdentityService> _logger;
    private readonly IIdentityRepository _repo;

    public IdentityService(ILogger<IdentityService> logger, IIdentityRepository repo)
    {
        _logger = logger;
        _repo = repo;
    }

    public override async Task<SubmitPIIResponse> SubmitPII(
            SubmitPIIRequest request, ServerCallContext context)
        {
            try
            {
                var root = JsonHelper.Parse(request.PiiJson);
                PiiValidator.Validate(root);

                string identityId = Guid.NewGuid().ToString();
                await _repo.SaveStagingAsync(identityId, request.PiiJson);

                return new SubmitPIIResponse
                {
                    ClientId = request.ClientId,
                    IdentityId = identityId,
                    Status = "SUCCESS"
                };
            }
            catch (Exception ex)
            {
                return new SubmitPIIResponse
                {
                    ClientId = request.ClientId,
                    Status = "ERROR",
                    ErrorMessage = ex.Message
                };
            }
        }

        public override async Task<ApprovePIIResponse> ApprovePII(
            ApprovePIIRequest request, ServerCallContext context)
        {
            if (!await _repo.ExistsAsync(request.IdentityId))
            {
                return new ApprovePIIResponse
                {
                    IdentityId = request.IdentityId,
                    Status = "ERROR_NOT_FOUND"
                };
            }

            await _repo.MarkApprovedAsync(request.IdentityId, request.ApprovalJson);

            return new ApprovePIIResponse
            {
                IdentityId = request.IdentityId,
                Status = "SUCCESS"
            };
        }

        public override async Task<EncryptPIIResponse> EncryptPII(
            EncryptPIIRequest request, ServerCallContext context)
        {
            try
            {
                var root = JsonHelper.Parse(request.PiiJson);
                PiiValidator.Validate(root);

                byte[] key = new byte[24];
                byte[] iv = new byte[16];
                RandomNumberGenerator.Fill(key);
                RandomNumberGenerator.Fill(iv);

                string encrypted = EncryptionHelper.EncryptAes192(request.PiiJson, key, iv);

                await _repo.StoreEncryptedAsync(request.IdentityId, encrypted);

                return new EncryptPIIResponse
                {
                    IdentityId = request.IdentityId,
                    Status = "SUCCESS",
                    EncryptedPii = encrypted
                };
            }
            catch (Exception ex)
            {
                return new EncryptPIIResponse
                {
                    IdentityId = request.IdentityId,
                    Status = "ERROR_ENCRYPTION_FAILED",
                    ErrorMessage = ex.Message
                };
            }
        }

         public override async Task<GenerateShadowIDResponse> GenerateShadowID(
            GenerateShadowIDRequest request, ServerCallContext context)
        {
            if (!await _repo.ExistsAsync(request.IdentityId))
            {
                return new GenerateShadowIDResponse
                {
                    IdentityId = request.IdentityId,
                    Status = "ERROR_NOT_FOUND"
                };
            }

            string shadowId = ShadowIdHelper.Generate();
            await _repo.StoreShadowIdAsync(request.IdentityId, shadowId);

            return new GenerateShadowIDResponse
            {
                IdentityId = request.IdentityId,
                Status = "SUCCESS",
                ShadowId = shadowId
            };
        }

        public override async Task<SearchIdentityResponse> SearchIdentity(
            SearchIdentityRequest request, ServerCallContext context)
        {
            try
            {
                var root = JsonHelper.Parse(request.SearchKeysJson);

                string? hashedFirstname = SearchKeyHelper.Get(root, "hashed_firstname");
                string? hashedDob = SearchKeyHelper.Get(root, "hashed_dob");

                var results = await _repo.SearchAsync(hashedFirstname, hashedDob);

                var response = new SearchIdentityResponse
                {
                    Status = "SUCCESS"
                };

                response.Results.AddRange(results);
                return response;
            }
            catch (Exception ex)
            {
                return new SearchIdentityResponse
                {
                    Status = "ERROR",
                    ErrorMessage = ex.Message
                };
            }
        }


        public override async Task<DecryptPIIResponse> DecryptPII(
            DecryptPIIRequest request, ServerCallContext context)
        {
            AuditHelper.LogDecrypt(request.IdentityId, request.AuditContextJson);

            string? encrypted = await _repo.GetEncryptedAsync(request.IdentityId);

            if (encrypted is null)
            {
                return new DecryptPIIResponse
                {
                    IdentityId = request.IdentityId,
                    Status = "ERROR_NOT_FOUND"
                };
            }

            byte[] key = new byte[24];
            byte[] iv = new byte[16];

            string decrypted = EncryptionHelper.DecryptAes192(encrypted, key, iv);

            return new DecryptPIIResponse
            {
                IdentityId = request.IdentityId,
                Status = "SUCCESS",
                PiiJson = decrypted
            };
        }
    
}
