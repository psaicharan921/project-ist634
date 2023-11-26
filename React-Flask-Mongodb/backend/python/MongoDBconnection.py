import pymongo
from decouple import config
from pymongo import errors
import logging

def getDatabseConnection():
    try:
        db_uri = config("DB_URI")

        # connecting database
        myclient=pymongo.MongoClient(
            db_uri
            )
        if myclient.is_connected():
            # creating database cursor
            print("The databse connection is requested")
            return myclient
        return None
    except errors.ConnectionFailure as e:
        logging.error("Error while connecting to MongoDB", e)
