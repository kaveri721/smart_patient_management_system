from fastapi import WebSocket

connections = []


async def connect(ws: WebSocket):

    await ws.accept()
    connections.append(ws)


async def broadcast(message):

    for connection in connections:
        await connection.send_text(message)