using Grpc.Core;
using the_identity;
using Microsoft.Extensions.Logging;

namespace the_identity.Services;

public class IdentityService : global::the_identity.IdentityService.IdentityServiceBase
{

    private readonly ILogger<IdentityService> _logger;

    public IdentityService(ILogger<IdentityService> logger)
    {
        _logger = logger;
    }

    
}
