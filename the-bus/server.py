import asyncio
import grpc
from grpc import aio
from grpc_reflection.v1alpha import reflection
import uvicorn
from socket.grpc_socket import DynamicGrpcGateway
from socket.websocket_socket import app  # Import the FastAPI app from your websocket_socket.py

# --- 2. THE DUAL-ENGINE COROUTINE SETUP ---
async def serve():
    # ---- Setup Engine A: Native gRPC Server ----
    server = aio.server()
    
    # DynamicGrpcGateway() is your custom class from your previous code
    server.add_generic_rpc_handlers((DynamicGrpcGateway(),)) 
    
    SERVICE_NAMES = ('bus.BusRouter', reflection.SERVICE_NAME)
    reflection.enable_server_reflection(SERVICE_NAMES, server)
    
    server.add_insecure_port('0.0.0.0:8000')
    print("🚀 True HTTP/2 gRPC Gateway listening on port 8000")
    await server.start()

    # ---- Setup Engine B: Asynchronous Uvicorn (FastAPI) ----
    config = uvicorn.Config(app, host="0.0.0.0", port=8001, log_level="info")
    uvicorn_server = uvicorn.Server(config)
    print("🔌 WebSockets HTTP Server listening on port 8001")

    # ---- Run Both Concurrently ----
    # Instead of wait_for_termination(), we wrap both long-running tasks 
    # so they execute on the exact same loop simultaneously.
    try:
        await asyncio.gather(
            server.wait_for_termination(),
            uvicorn_server.serve()
        )
    except asyncio.CancelledError:
        print("\n🛑 Shutdown signal received. Stopping servers...")
        # Gracefully stop the gRPC engine during cancellation
        await server.stop(grace=5)

if __name__ == "__main__":
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        print("\n👋 Exited cleanly.")
