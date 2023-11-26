from flask import Flask , render_template, request, url_for, redirect 
from flask_pymongo import PyMongo
import os


app = Flask(__name__)

# read database configuration from .evn file 
token = os.getenv("ACCESS_TOKEN")
db_uri = os.getenv("DB_URI")


app.config['MONGO_URI'] = db_uri

mongo = PyMongo(app)

@app.route('/')
def hello():
    return 'Welcome to Flask python backend..!'


# @app.route('/pet', methods=['GET'])
# def getcdc():
    
#     query = { "price" : { "$gt" : 10 } }
#     result = list(mongo.db.books.find(query))
#     print(result)

#     for i in range(len(result)):
#         del result[i]['_id']
#     print(result)

#     return result

@app.route('/numberofinsurances', methods=['POST'])
def getinsurances():

    val=request.json['option']
    print(val)

    if val == "$Year_Claimed" :
        query = [{"$group": {"_id": val, "count": {"$sum": 1 }}}]
        result = list(mongo.db.Fraud.aggregate(query))
        print(result)
    else:
        query1 = [{"$group": {"_id": val, "count": {"$sum": 1 }}},{"$sort" : {"count":1}}]
        result = list(mongo.db.Fraud.aggregate(query1))
        print(result)

    return result

@app.route('/numberofaccidents', methods=['POST'])
def getaccidents():

    val=request.json['accident']
    print(val)

    if val == "$accident.Accident_Area_Type":
        query1 = [{"$lookup":{"from":"Accident","localField":"Accident_Area","foreignField":"_id","as":"accident"}},{"$group":{"_id": val,"count":{"$sum":1}}}]
        result = list(mongo.db.Fraud.aggregate(query1))
        print(result)
    else:
        query2 = [{"$lookup":{"from":"Accident","localField":"Accident_Area","foreignField":"_id","as":"accident"}},{"$group":{"_id": val,"count":{"$sum":1}}}]
        result = list(mongo.db.Fraud.aggregate(query2))
        print(result)
    
    return result

@app.route('/vehiclemake', methods=['GET'])
def getvehiclemake():

    query = "Vehicle_Make"
    result = list(mongo.db.Vehicle.distinct(query))
    print(result)
 
    return result


@app.route('/vehiclecategory', methods=['POST'])
def getvehiclecategory():

    val=request.json['vehicle']
    print(val)

    query = {"Vehicle_Make" : val}
    result = list(mongo.db.Vehicle.distinct("Vehicle_Category",query))
    print(result)
 
    return result

@app.route('/vehicleaccidents', methods=['POST'])
def getvehicleaccidents():

    val=request.json['vehicle']
    print(val)

    query = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "vehicle.Vehicle_Make": val[0], "vehicle.Vehicle_Category": val[1] } }, { "$lookup": { "from": "Accident", "localField": "Accident_Area", "foreignField": "_id", "as": "accident" } }, { "$unwind": "$accident" }, { "$group": { "_id": "$accident.Accident_Area", "count": { "$sum": 1 } } }]
    result = list(mongo.db.Fraud.aggregate(query))
    print(result)
 
    return result

    
@app.route('/frauds', methods=['GET'])
def getfrauds():

    query = [{ "$group" : { "_id" : "$Fraud" , "count" : { "$sum" : 1} }},{"$sort" : {"count": -1}}]
    result = list(mongo.db.Fraud.aggregate(query))
    print(result)
 
    return result

@app.route('/fraudvehicleinsurances', methods=['POST'])
def getfraudvehicleinsurances():

    var=request.json['Vehicle']
    print(var)
    
    results=[]

    for x in range(2):
        query = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "vehicle.Vehicle_Make": var , "Fraud" : x } }, { "$group": { "_id": "$vehicle.Vehicle_Make", "avg": { "$avg": "$Insurance_Amount" } } }]
        val = list(mongo.db.Fraud.aggregate(query))

        if val :
            query1 = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$group": { "_id": { "Make" : "$vehicle.Vehicle_Make" , "Fraud" : "$Fraud" }, "avg": { "$avg": "$Insurance_Amount" } } }, { "$sort": { "_id": 1 } }, { "$project" : { "Make" : "$_id.Make" , "Fraud" : "$_id.Fraud" , "avg" : 1 , "_id" : 0 } },{ "$match": { "$and" : [{ "Make": { "$ne": val[0]["_id"] } }, { "avg" : { "$gt" : val[0]["avg"] } } ,{ "Fraud" : { "$eq" : x }}] }}]
            result = list(mongo.db.Fraud.aggregate(query1))
            print(result)

            results.append(result)

    return results


@app.route('/insuranceamountpercentage', methods=['POST'])
def getinsuranceamountpercentage():

    val = request.json['Fraud']
    print(val)

    query = [{ "$group": { "_id": "$Fraud", "Total": { "$sum": "$Insurance_Amount" } } }, { "$match": { "_id": val } }]
    res = list(mongo.db.Fraud.aggregate(query))
    print(res[0]['Total'])
    if res :
        query1 = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "Fraud": 0 } }, { "$group": { "_id": "$vehicle.Vehicle_Make", "sum": { "$sum": "$Insurance_Amount" } } }, { "$project": { "percentage": { "$round": [{ "$multiply": [{ "$divide": ["$sum", res[0]["Total"]] }, 100] }, 3] } } }, { "$sort": { "percentage": 1 } }]
        result = list(mongo.db.Fraud.aggregate(query1))
        print(result)
 
    return result

# @app.route('/policy', methods=['GET'])
# def getaverageofinsuranceamountbypolicy():

#     query = [{ "$lookup": { "from": "Vehicle", "let": { "vehicleId": "$Vehicle" }, "pipeline": [{ "$match": { "$expr": { "$eq": ["$_id", "$$vehicleId"] } } }], "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "$expr": { "$and": [ { "$eq": ["$Base_Policy", "All Perils"] }, { "$gt": ["$Insurance_Amount", { "$avg": { "$filter": { "input": "$vehicle.Fraud", "as": "fraud", "cond": { "$eq": ["$$fraud.Base_Policy", "$Base_Policy"] } } } }] } ] } } }, { "$group": { "_id": "$vehicle.Vehicle_Make", "Average": { "$avg": "$Insurance_Amount" } } }, { "$project": { "_id": 0, "Vehicle_Make": "$_id", "Average": 1 } }, { "$sort": { "Vehicle_Make": 1 } }]
#     result = list(mongo.db.Fraud.aggregate(query))
#     print(result)
 
#     return result

@app.route('/vehcilecategorygender', methods=['POST'])
def getvehcilecategorygender():

    val = request.json['Category']
    print(val)

    res=[]

    if val:
        query = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "vehicle.Vehicle_Category": val , "Sex" : "Male" } }, { "$lookup": { "from": "Accident", "localField": "Accident_Area", "foreignField": "_id", "as": "accident" } }, { "$unwind": "$accident" }, { "$group": { "_id": "$accident.Accident_Area" , "count": { "$sum": 1 } } },{"$sort" : { "_id" : 1}}]
        result = list(mongo.db.Fraud.aggregate(query))
        print(result)
        res.append(result)

        if result:

            query1 = [{ "$lookup": { "from": "Vehicle", "localField": "Vehicle", "foreignField": "_id", "as": "vehicle" } }, { "$unwind": "$vehicle" }, { "$match": { "vehicle.Vehicle_Category": val , "Sex" : "Female" } }, { "$lookup": { "from": "Accident", "localField": "Accident_Area", "foreignField": "_id", "as": "accident" } }, { "$unwind": "$accident" }, { "$group": { "_id": "$accident.Accident_Area" , "count": { "$sum": 1 } } },{"$sort" : { "_id" : 1}}]
            result1 = list(mongo.db.Fraud.aggregate(query1))
            print(result1)
            res.append(result1)
 
    return res





if __name__ == '__main__':
    app.run(debug=True)
