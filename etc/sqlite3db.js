
// allows to access this function outside the scope
module.exports = {
	
  CreatingDbFile: function (database) {	  
	// calling implementation function and delegating all work to it
    CreatingDbFileImpl(database);
  }
  
};



// If there is no file created, creating new one using function
function CreatingDbFileImpl(database){
	

	// slicing the .json file name, to get name without .json
	var FileName = database.file.slice(0,database.file.length-5);
	/*
	 *	WARN Global Changes!
	 *	creating new variable with table name
	 */
		database.table = database.file.slice(0,database.file.length-5);
	
	// requiring file stream
	var fs = require("fs");
	var file = BIN_FOLDER + database.table + SQLITE3_BIN_TYPE;
	
	// checking if the file exists on based path
	// remove ! -> just for testing purp
	var exists = fs.existsSync(file);

	// if file doesn't exists, we generating new one
	if(!exists) {
	  console.log("Generating sqlite3 database file. -> " + file);
	  
	  // opening file with writing rights, it will override the file, in case it exists
	  fs.openSync(file, "w");
	}
	
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
	var sqlite3 = require("sqlite3").verbose();
	var db = new sqlite3.Database(file);
	
	db.serialize(function(){
		
		/*
		 *	array of columns that this API will generate
		 *	I will set x,y type float. In case user used other names:
		 *	I will let them define that in config.json file
		 *	
		 */ 
		// array of columns that will be used to create table
		var columns = [];
		// defining primary key column
		columns.push({
			"column" : "id",
			"type" : "INTEGER PRIMARY KEY AUTOINCREMENT"
			});

		// user predefined columns in config.json
		database.userdef = swap(database.columns);
		
		// looping through first record and looking for columns that we will use to add into db
		for (dataKey in data[0]){
			// if this column is defined by user,
			// there are just 2 that I am interested in (x,y to be saved as float in db)
			if (dataKey in database.userdef){
				var defcol = database.userdef[dataKey];
				switch(defcol){
					case "x":
						columns.push({
							"column" : database.userdef[dataKey].toLowerCase(),
							"type" : "FLOAT"
						});
						break;
					case "y":
						columns.push({
							"column" : database.userdef[dataKey].toLowerCase(),
							"type" : "FLOAT"
						});
						break;
					default :
						columns.push({
							"column" : database.userdef[dataKey].toLowerCase(),
							"type" : "VARCHAR(255)"
						});
						break;
				}
			} else {
				// if data type is not defined by user,
				// all numeric assign as floats and all string as varchar
				switch(typeof(data[0][dataKey])){
					case "number":
						columns.push({
							"column" : dataKey.toLowerCase(),
							"type" : "FLOAT"
						});
						break;
					case "string":
						columns.push({
							"column" : dataKey.toLowerCase(),
							"type" : "VARCHAR(255)"
						});
						break;
				}
			}
				
		}

		// preparing statement
		var sqlStatement = "";
		// concatinating columns into statemnt
		for (col in columns){
			// if statement is not empty add comma
			if (sqlStatement!=""){
				sqlStatement += ",";
			}
			sqlStatement += "\n" + columns[col].column + " " + columns[col].type;
		}
		
		// wrapping around sql syntax create table statement
		sqlStatement = "\nCREATE TABLE IF NOT EXISTS " + database.table 
						+"\n("
						+ sqlStatement
						+"\n)";
						
		// display the sql statement
		if (SHOW_CREATE_TABLE)
			console.log(sqlStatement);
	
		// running statement
		db.run(sqlStatement);
		
		/*
		 * WARN Global Changes!
		 *	overriding columns into better structure
		 */
			database.columns = columns;
		
		
		
		
	});
	
	// checking if there is any records in table
	// if not, then adding default from .json file
	db.all("SELECT * FROM " + database.table, function(err,rows){

		if (rows.length == 0)
			// Inserting record set into db 
			InsertRecordSet(db, database, data);
	});
	
	db.close();
}

function InsertRecordSet(db, database, data){
	var sqlColumns = "";
	var sqlValues = "";
	
	// creating a prepared statement with defined index using @
	for (col in database.columns){
		// concatinating column names into one string
		if (sqlColumns != ""){
			sqlColumns += ",";
		}		
		sqlColumns += database.columns[col].column;
		
		// concatinating row value indexes into one string 
		if (sqlValues != ""){
			sqlValues += ",";
		}
		sqlValues += " @"+database.columns[col].column;
	}
	
	// concatinating whole prepared statement
	var sqlStatement = "INSERT INTO " + database.table
		+ "(" + sqlColumns + ") VALUES "
		+"(" + sqlValues +")";
	
	// for each data row in .json
	// defining array with keys and values
	// to populate the table
	data.forEach(function (row){
		
		// default parameter id = null -> it is autoinc
		var sqlParams = {'@id': null};
		
		for( cell in row){
			// separating if user defined the column or not
			// and pushing values into array
			if (cell in database.userdef){
				var key = "@" + database.userdef[cell].toLowerCase();
				sqlParams[key] = row[cell];				
			} else {
				var key = "@" + cell.toLowerCase();
				sqlParams[key] = row[cell];	
			}
			
		}

		// running concat statement with array{key:value}
		db.run(sqlStatement,sqlParams,function(err){
			// if any error occured they can be displayed in console
			// or we can see prepared sql statement
			if (SHOW_INSERT_INTO_TABLE){
				console.log(
					(err) ? err : sqlStatement
				);				
			}
			
		});
		
	});
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