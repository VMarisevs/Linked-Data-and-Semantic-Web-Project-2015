// allows to access this function outside the scope
module.exports = {
	
  DeleteRecord: function (database, id, res) {	  
	// calling function to return record
    return DeleteRecordImpl(database, id, res);
  }
  
};


function DeleteRecordImpl(database, id, res){
	var result;
	
	// based on database type selecting which to connect to
	switch(database.dbtype){
		
		case "sqlite3" :
			// requiring sqlite3 db connection file
			var sqlite3db = require('./sqlite3db.js');
			result = sqlite3db.DeleteRecord(database, id, res);
			break;
			
		default :
			// if database type wasn't defined, then it will run this commands
			result = "Error getting database type! In 'delete-record.js'.GetRecord. Type : '" + database.dbtype + "' is not defined";
			console.log("Error, undefined database type requested : '" + database.dbtype + "'");
			break;
	}
	
	return result;
}