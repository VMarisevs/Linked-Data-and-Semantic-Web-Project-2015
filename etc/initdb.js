
// allows to access this function outside the scope
module.exports = {
	
  DatabaseInit: function () {	  
	// calling function to load config file and create new tables
    LoadConfigFile();
  }
  
};

// running function to load configuration file .json
LoadConfigFile();

function LoadConfigFile(){
	// Loading db sqlite3 module
	var sqlite3db = require('./sqlite3db.js');

	// requiring file stream
	var fs = require("fs");
	
	// loading configuration file with database descriptions	
	DATABASES = JSON.parse(fs.readFileSync( CONFIG_FILE ,'utf8'));
	
	// looping through all defined databases, and calling functions to create binary files
	DATABASES.forEach(function(database){
		
		/*
		 *	if database type is not defined by user or there is a mistake,
		 *	by default I will use SQLite3 module database
		 *
		 */ 
		
		switch (database.dbtype){
			
			case "sqlite3" :
				// user defined to use sqlite3 database
				sqlite3db.CreatingDbFile(database);
				break;
				
			default :
				/*
				 *	WARN in case "dbtype" is not defined, I will do it for user
				 */
				 
				database.dbtype = "sqlite3";
				
				// incase of mistake/undefined database type
				sqlite3db.CreatingDbFile(database);
				break;
		}
	});
}
