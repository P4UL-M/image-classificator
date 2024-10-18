from pymongo import MongoClient
import pymongo
import pymongo.database
import os

PORT = int(os.getenv('MONGO_PORT', 27017))
HOST = os.getenv('MONGO_HOST', 'localhost')
DB_NAME = os.getenv('MONGO_DB_NAME', 'image_classificator')


class DBService:
    client: MongoClient | None = None
    db: pymongo.database.Database | None = None

    @staticmethod
    def get_instance():
        if DBService.client is None:
            DBService.client = MongoClient(HOST, PORT)
        return DBService.client

    @staticmethod
    def get_db():
        if DBService.db is None:
            DBService.db = DBService.get_instance()[DB_NAME]
        return DBService.db

    @staticmethod
    def init_collections():
        db = DBService.get_db()
        if 'images' not in db.list_collection_names():
            db.create_collection('images')

    def __init__(self):
        self.init_collections()

    def insert_image(self, image):
        self.db.images.insert_one(image)

    def get_image(self, image_id):
        return self.db.images.find_one({'_id': image_id})

    def get_all_images(self):
        return self.db.images.find()

    def __del__(self):
        if self.db is not None:
            self.db = None
        if self.client is not None:
            self.client.close()
            self.client = None
