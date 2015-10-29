// allows to access this function outside the scope
module.exports = {
	
  GetRecords: function (database, res) {	  
	// calling function to return records
    return GetRecordsImpl(database, res);
  }
  
};


function GetRecordsImpl(database, res){
	var result;
	
	// based on database type selecting which to connect to
	switch(database.dbtype){
		
		case "sqlite3" :
			// requiring sqlite3 db connection file
			var sqlite3db = require('./sqlite3db.js');
			result = sqlite3db.SelectRecords(database,  res);
			break;
			
		case "pouchdb" :
			var pouchdb = require('./pouchdbcon.js');
			result = pouchdb.SelectRecords(database, res);
			break;
			
		default :
			// if database type wasn't defined, then it will run this commands
			result = "Error getting database type! In 'get-records.js'.GetRecords. Type : '" + database.dbtype + "' is not defined";
			console.log("Error, undefined database type requested : '" + database.dbtype + "'");
			break;
	}
	
	return result;
}