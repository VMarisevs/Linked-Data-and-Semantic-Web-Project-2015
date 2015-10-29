
// allows to access this function outside the scope
module.exports = {
	
	// creating db bin files and preparing API to work
	CreatingDbFile : function (database){	  
		// calling implementation function and delegating all work to it
		CreatingDbFileImpl(database);
	},
  
	// Selecting one record from database
	SelectRecord : function (database, id, res){
		var result = SelectRecordImpl(database, id, res);
		return result;
	},

	// Selecting all records from database
	SelectRecords : function (database, res){
		var result = SelectRecordsImpl(database, res);
		return result;
	},
	
	// Insert record into database
	InsertRecord : function(database, record, res){
		var result = InsertRecordImpl(database, record, res);
		return result;
	},
	
	// Update record in database
	UpdateRecord : function(database, record, res){
		var result = UpdateRecordImpl(database, record, res);
		return result;
	},
	
	// Delete record from database
	DeleteRecord : function(database, record, res){
		var result = DeleteRecordImpl(database, record, res);
		return result;
	}
  
};



// If there is no file created, creating new one using function
function CreatingDbFileImpl(database){
	
	// database path
	var file = getFile(database);
	
	// calling function to create db
	CreateDb(database, file);
};

function CreateDb(database,  file){
	
	// requiring file stream
	var fs = require('fs');	
	// loading data from .json file
	var data = JSON.parse(fs.readFileSync( DATASET_FOLDER + database.file,'utf8'));
	
	
	/*
	 * Creating database table
	 */
	
	// requiring sqlite3 module
	
	var PouchDB = require('pouchdb');
	
	var db = new PouchDB(file);
	
	db.allDocs({include_docs: true, descending: true}, function(err, doc) {
		/* creating db columns */
		
		var columns = [
			{ "column" : "_id", "type" : "String"}
			// comment next line to ignore _rev
			//,{ "column" : "_rev", "type" : "String"}
			];
		
		for (dataKey in data[0]){
			if (dataKey in database.userdef){
				columns.push({
					"column" : database.userdef[dataKey],
					"type" : "String"
				});
			} else {
				columns.push({
					"column" : dataKey,
					"type" : "String"
				});
			}
			
		}
		/*
		 * WARN Global Changes!
		 *	overriding columns into better structure
		 */
			database.columns = columns;
		
		// if there is no records, inserting from dataset
		if (doc.total_rows == 0){
			InsertRecordSet(db, database, data);
		}
	});
	
}

function InsertRecordSet(db, database, data){
	
	data.forEach(function (row){

		db.post(row).then(function (response) {
		  // handle response
		}).catch(function (err) {
		  console.log(err);
		});
	});
}

function SelectRecordImpl(database, id, res){
	// getting file path for this database
	var file = getFile(database);
	// requiring pouchdb module
	var PouchDB = require('pouchdb');
	// defining database to connect to
	var db = new PouchDB(file);
	
	
	db.get(id).then(function (doc) {
		//console.log(doc);
		res.json(doc);
	}).catch(function (err) {
	  console.log(err);
	});
	
}

function SelectRecordsImpl(database, res){
	// getting file path for this database
	var file = getFile(database);
	// requiring pouchdb module
	var PouchDB = require('pouchdb');
	// defining database to connect to
	var db = new PouchDB(file);
	
	// fetching all records
	db.allDocs({include_docs: true, descending: true}, function(err, doc) {
		var result = [];
		// trying to get just doc information from whole record
		for(key in doc.rows){
			console.log(doc.rows[key].doc);
			result.push(doc.rows[key].doc);
		}
		
		res.json(result);
	});
	
}

function InsertRecordImpl(database, record, res){
	// getting file path for this database
	var file = getFile(database);
	// requiring pouchdb module
	var PouchDB = require('pouchdb');
	// defining database to connect to
	var db = new PouchDB(file);
	
	db.post(record).then(function (response) {
		res.json("ok");
	}).catch(function (err) {
		res.json(err);
	});
	
}

function UpdateRecordImpl(database, record, res){
	return false;
}

function DeleteRecordImpl(database, id, res){
	return false;	
}

function getFile(database){
	// file path
	var file = BIN_FOLDER + POUCHDB_PARENT_FOLDER + database.table;
	return file;
}