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
    server.add_insecure_port(f'[::]:{port}')
    await server.start()
    print(f'Starting server on port {port}')
    await server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    # Create an event loop and run the server
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(serve())
    except KeyboardInterrupt:
        print("Shutting down server...")
    finally:
        loop.run_until_complete(loop.shutdown_asyncgens())
        loop.close()
