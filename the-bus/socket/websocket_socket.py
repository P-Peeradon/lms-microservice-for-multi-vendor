from fastapi import FastAPI

app = FastAPI()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket, client_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message from {client_id}: {data}")