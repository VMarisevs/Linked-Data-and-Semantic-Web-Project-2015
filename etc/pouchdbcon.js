
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
			database.userdef = swap(database.userdef);
		
		// if there is no records, inserting from dataset
		if (doc.total_rows == 0){
			console.log("Generating pouch database folder. -> " + file);
			InsertRecordSet(db, database, data);
		}
	});
	
}

function InsertRecordSet(db, database, data){

	// for each record in dataset
	data.forEach(function (row){
		/*
		 *	If user defined a different name for column
		 *	Parsing the information from db and inserting a new row
		 */
		var newRecord = {};
		// each defined column
		database.columns.forEach(function (col){
			// name of readed row from .json combined with name defined by user
			var colname = (database.userdef[col.column]) ? database.userdef[col.column] : col.column;
			newRecord[col.column] = row[colname];
		});

		// posting the record into pouchdb
		db.post(newRecord).then(function (response) {			
			// show records in console
			if (SHOW_INSERT_INTO_TABLE){
				console.log(newRecord);
				console.log("Inserted into pouchdb");
			}
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
	
	// get record by id
	db.get(id).then(function (doc) {
		// show record in console
		if (SHOW_REQUESTED_RECORDS)
			console.log(doc);
		
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
			// show records in console
			if (SHOW_REQUESTED_RECORDS)
				console.log(doc.rows[key].doc);
			
			// pushing into array to make same structure as sqlite3
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
	
	// post the new record, return ok or err to user
	db.post(record).then(function (result) {
		
		// show in console inserted record
		if (SHOW_INSERT_INTO_TABLE){			
			console.log(record);
			console.log("Inserted into pouchdb");
		}
		
		res.json("ok");
	}).catch(function (err) {
		res.json(err);
	});
	
}

function UpdateRecordImpl(database, record, res){
	// getting file path for this database
	var file = getFile(database);
	// requiring pouchdb module
	var PouchDB = require('pouchdb');
	// defining database to connect to
	var db = new PouchDB(file);
	
	console.log(record["_id"]);
	// get record that we want to update (we need _rev)
	db.get(record['_id']).then(function (doc) {
		
		/*
		 *	creating temp object
		 *	this object copies information from updated record
		 *	to make it case insensitive
		 */
		
		var tempRecord = {};
		for (key in record){
			// setting key to lower case
			var lowerCaseKey = key.toLowerCase();
			// creating key value object with lowercase key
			tempRecord[lowerCaseKey] = record[key];
		}
		
		// new record that will be passed
		var newRecord = {};
		database.columns.forEach(function(col){
			// creating an object based on passed column names
			newRecord[col.column] = (tempRecord[col.column.toLowerCase()]) ? tempRecord[col.column.toLowerCase()] : doc[col.column];
		});
		
		// passing _rev to to new record
		newRecord["_rev"] = doc["_rev"];
		
		if (SHOW_RECORD_UPDATES)
			console.log(newRecord);
		
		// updating record
		db.put(newRecord);
		
		// returning ok to a user
		res.json("ok");
		
	}).catch(function (err) {
		// returning error
		res.json(err);
	});
}

function DeleteRecordImpl(database, id, res){
	// getting file path for this database
	var file = getFile(database);
	// requiring pouchdb module
	var PouchDB = require('pouchdb');
	// defining database to connect to
	var db = new PouchDB(file);
	
	// get record that we want to delete (we need _rev)
	db.get(id).then(function (doc) {
		// removing the record
		db.remove(doc)
		// returning ok to a user
		res.json("ok");
		
	}).catch(function (err) {
		// returning error
		res.json(err);
	});
	
}

function getFile(database){
	// file path
	var file = BIN_FOLDER + POUCHDB_PARENT_FOLDER + database.table;
	return file;
}

// swap keys and values
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}