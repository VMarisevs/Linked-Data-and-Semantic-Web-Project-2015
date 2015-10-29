
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
		
		doGlobalChanges(database);
		
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

function doGlobalChanges(database){
	/*
	 *	WARN Global Changes!
	 *	
	 */
	 
	 // slicing the .json file name, to get name without .json
	 // for a table name and route
	 database.table = database.file.slice(0,database.file.length-5);
	 
	 // user predefined columns in config.json
		database.userdef = swap(database.columns);
}


/*
 *	[This function was borrowed] (http://stackoverflow.com/questions/23013573/swap-key-with-value-json)
 */
// swap keys and values
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}
