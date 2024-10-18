import asyncio
from concurrent import futures
import logging
import grpc

import generated.mlService_pb2_grpc as ml_grpc
from service.mlServer_service import mlServer


async def serve():
    port = 9090
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    ml_grpc.add_ImageClassificatorServicer_to_server(mlServer(), server)
    server.add_insecure_port(f'0.0.0.0:{port}')
    await server.start()
    print(f'Starting server on port {port}')
    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        print("Server stopped")
        await server.stop(0)
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise e

if __name__ == '__main__':
    logging.basicConfig()
    server = None  # Declare server in outer scope
    try:
        # Run the server and store the server object
        server = asyncio.run(serve())
    except KeyboardInterrupt:
        print("Server stopped by the user")
