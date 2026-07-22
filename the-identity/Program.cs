using the_identity.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection(); // Enable gRPC reflection

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<IdentityService>();
app.MapGrpcReflectionService(); // Expose reflection endpoint

app.Run("http://localhost:5188");
