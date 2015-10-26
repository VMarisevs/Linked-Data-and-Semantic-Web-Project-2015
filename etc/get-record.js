// allows to access this function outside the scope
module.exports = {
	
  GetRecord: function (database,id,res) {	  
	// calling function to return record
    return GetRecordImpl(database, id, res);
  }
  
};


function GetRecordImpl(database, id, res){
	var result;
	
	// based on database type selecting which to connect to
	switch(database.dbtype){
		
		case "sqlite3" :
			// requiring sqlite3 db connection file
			var sqlite3db = require('./sqlite3db.js');
			result = sqlite3db.SelectRecord(database, id, res);
			break;
			
		default :
			// if database type wasn't defined, then it will run this commands
			result = "Error getting database type! In 'get-record.js'.GetRecord. Type : '" + database.dbtype + "' is not defined";
			console.log("Error, undefined database type requested : '" + database.dbtype + "'");
			break;
	}
	
	return result;
}