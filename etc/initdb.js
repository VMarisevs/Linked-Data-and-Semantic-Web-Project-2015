
// Loading db sqlite3 module
var sqlite3db = require('./sqlite3db.js');

// running function to load configuration file .json
LoadConfigFile();

function LoadConfigFile(){
	// requiring file stream
	var fs = require("fs");
	
	// loading configuration file with database descriptions	
	var dblist = JSON.parse(fs.readFileSync( CONFIG_FILE ,'utf8'));
	
	// looping through all defined databases, and calling functions to create binary files
	dblist.forEach(function(database){
		
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
				// incase of mistake/undefined database type
				sqlite3db.CreatingDbFile(database);
				break;
		}
	});
}