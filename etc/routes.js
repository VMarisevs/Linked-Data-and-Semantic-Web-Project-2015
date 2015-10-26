// allows to access this function outside the scope
module.exports = {
	
  DefineRoutes: function (varExpress) {	  
	// calling function to define all routes
    DefineRoutesImpl(varExpress);
  }
  
};

function DefineRoutesImpl(varExpress){
	// Import body parser to work with POST/PUT/DELETE data
	var bodyParser = require('body-parser');
	varExpress.use(bodyParser.json()); // support json encoded bodies
	varExpress.use(bodyParser.urlencoded({ extended: true }));

	// default route which displays all database in API
	varExpress.get('/',function(req,res){
		res.json(DATABASES);
	});
	
	// defining routes for each of the databases
	DATABASES.forEach(function(database){
		/*
		 *	All routes will be defined in here
		 *	GET -> will be responsible for returning all records and in case defined, single record
		 *	PUT -> will be responsible for inserting record into database
		 *	POST -> will be responsible for updating records in database
		 *	DELETE -> will be resposible for deleting records from database
		 */
		 
		var route = database.table;
		
		
		// This route will return all records from database
		// http://localhost:8000/GalwayCity_OpenData_CarParking
		varExpress.get("/" + route, function(req,res){
			// requesting get-records.js file
			var getRecord = require('./get-records.js');
			// running GetRecords function and passing database array, and result
			getRecord.GetRecords( database, res);
		});
		
		
		// This route will return selected record from database
		// http://localhost:8000/GalwayCity_OpenData_CarParking/2
		varExpress.get( "/" + route +"/:id", function(req,res){
			// requesting get-record.js file
			var getRecord = require('./get-record.js');
			// running GetRecord function and passing database array, and result
			getRecord.GetRecord( database, req.params.id, res);			
		});
		
		
		// curl.exe -X PUT --data "x=1&y=2&name=new Record&type=some Type&no_spaces=200&lat=12&long=33&eastitm=32&northitm=22&eastig=321&northig=432" http://localhost:8000/GalwayCity_OpenData_CarParking/insert
		varExpress.put( "/" + route + "/insert", function(req,res){
			// requesting put-record.js file
			var putRecord = require('./put-record.js');
			//running insert function
			putRecord.InsertRecord( database, req.body, res);
		});
		
		
		// curl.exe -X POST --data "id=1&x=0.05&y=-0.05&name=update works&no_spaces=999" http://localhost:8000/GalwayCity_OpenData_CarParking/update
		varExpress.post( "/" + route + "/update", function(req,res){
			// requesting post-update.js file
			var updateRecord = require('./post-update.js');
			//running update function
			updateRecord.UpdateRecord( database, req.body, res);
		});
		
		
		// curl.exe -X DELETE --data "id=11" http://localhost:8000/GalwayCity_OpenData_CarParking/delete
		varExpress.delete( "/" + route + "/delete", function(req,res){
			console.log(req.body.id);
			//res.json(req.body.id);
		});
		
	});
}