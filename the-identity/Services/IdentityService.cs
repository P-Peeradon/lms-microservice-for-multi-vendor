using Grpc.Core;
using the_identity;

namespace the_identity.Services;

public class IdentityService : Identity.IdentityBase
{

    public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
    {
        return Task.FromResult(new HelloReply
        {
            Message = "Hello " + request.Name
        });
    }
}
