using Grpc.Core;
using the_identity;

namespace the_identity.Services;

public class IdentityService : Identity.IdentityBase
{

    private readonly ILogger<IdentityService> _logger;

    public IdentityService(ILogger<IdentityService> logger)
    {
        _logger = logger;
    }

    public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
    {

        _logger.LogInformation("[C# Identity] Dynamic call invoked for: {Name}", request.Name);

        return Task.FromResult(new HelloReply
        {
            Message = $"Hello {request.Name}, greetings dynamically from C# Identity microservice!"
        });
    }
}
