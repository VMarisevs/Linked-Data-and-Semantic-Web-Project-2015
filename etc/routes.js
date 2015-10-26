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
		 
		var route = "/" + database.table;
		
		// This route will return all records from database
		varExpress.get(route, function(req,res){
			res.json(database);
		});
		
		// This route will return selected record from database
		varExpress.get(route +"/:id", function(req,res){
			res.json(req.params.id);
		});
		
		// curl.exe -X PUT --data "id=44" http://localhost:8000/GalwayCity_OpenData_CarParking/insert
		varExpress.put(route + "/insert", function(req,res){
			console.log(req.body.id);
			//res.json(req.body.id);
		});
		
		// curl.exe -X POST --data "id=11" http://localhost:8000/GalwayCity_OpenData_CarParking/update
		varExpress.post(route + "/update", function(req,res){
			console.log(req.body.id);
			//res.json(req.body.id);
		});
		
		
		varExpress.delete(route + "/delete", function(req,res){
			console.log(req.body.id);
			//res.json(req.body.id);
		});
		
	});
}