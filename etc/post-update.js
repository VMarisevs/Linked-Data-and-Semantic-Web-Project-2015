// allows to access this function outside the scope
module.exports = {
	
  UpdateRecord: function (database, record, res) {	  
	// calling function to return record
    return UpdateRecordImpl(database, record, res);
  }
  
};


function UpdateRecordImpl(database, record, res){
	var result;
	
	// based on database type selecting which to connect to
	switch(database.dbtype){
		
		case "sqlite3" :
			// requiring sqlite3 db connection file
			var sqlite3db = require('./sqlite3db.js');
			result = sqlite3db.UpdateRecord(database, record, res);
			break;
		
		case "pouchdb" :
			// requiring pouch db connection file
			var pouchdb = require('./pouchdbcon.js');
			result = pouchdb.UpdateRecord(database, record, res);
			break;
		
		default :
			// if database type wasn't defined, then it will run this commands
			result = "Error getting database type! In 'post-update.js'.GetRecord. Type : '" + database.dbtype + "' is not defined";
			console.log("Error, undefined database type requested : '" + database.dbtype + "'");
			break;
	}
	
	return result;
}