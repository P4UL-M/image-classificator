import asyncio
from concurrent import futures
import logging
import grpc

import generated.mlService_pb2_grpc as ml_grpc
from service.mlServer_service import mlServer

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


async def serve():
    port = 9090
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    ml_grpc.add_ImageClassificatorServicer_to_server(mlServer(), server)
    server.add_insecure_port(f'[::]:{port}')
    logging.info(f'Starting server on port {port}')
    await server.start()
    logging.info(f'Server listening on port {port}')
    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        logging.info("Server stopped")
        await server.stop(0)
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise e

if __name__ == '__main__':
    server = None  # Declare server in outer scope
    try:
        # Run the server and store the server object
        server = asyncio.run(serve())
    except KeyboardInterrupt:
        logging.info("Server stopped by the user")
