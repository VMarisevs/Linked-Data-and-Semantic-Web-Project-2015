
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
	
	// requiring file stream
	var fs = require("fs");
	var file = BIN_FOLDER + FileName + SQLITE3_BIN_TYPE;
	
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
	CreateDb(database, file, FileName);
};

function CreateDb(database,  file, fileName){
	
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
		columns.push("'id' INTEGER PRIMARY KEY AUTOINCREMENT");
		
		// user predefined columns in config.json
		var definedCol = swap(database.columns);
		
		// looping through first record and looking for columns that we will use to add into db
		for (dataKey in data[0]){
			// if this column is defined by user,
			// there are just 2 that I am interested in (x,y to be saved as float in db)
			if (dataKey in definedCol){
				switch(definedCol[dataKey]){
					case "x":
						columns.push("'"+ definedCol[dataKey] +"' FLOAT");
						break;
					case "y":
						columns.push("'"+ definedCol[dataKey] +"' FLOAT");
						break;
					default :
						columns.push("'" + definedCol[dataKey] + "' VARCHAR(255)");
						break;
				}
			} 
			// in case user didn't defined x,y in config.json
			else if (dataKey.toLowerCase() == "x" || dataKey.toLowerCase() == "y" ){
				columns.push("'"+ dataKey.toLowerCase() +"' FLOAT");
			} 
			// in case user didn't define "name" column and making this name to lowercase
			else if (dataKey.toLowerCase() == "name"){
				columns.push("'" + dataKey.toLowerCase() + "' VARCHAR(255)");
			} 
			// if nothing was defined I am adding this column into table as well
			else if (dataKey != "id"){
				columns.push("'" + dataKey + "' VARCHAR(255)");
			}
				
		}

		// preparing statement
		var sqlStatement = "";
		// concatinating columns into statemnt
		columns.forEach(function(col){
			
			// if statement is not empty add comma
			if (sqlStatement!=""){
				sqlStatement += ",";
			}
			sqlStatement += "\n" + col;
		});
		
		// wrapping around sql syntax create table statement
		sqlStatement = "\nCREATE TABLE IF NOT EXISTS " + fileName 
						+"\n("
						+ sqlStatement
						+"\n)";
						
		// display the sql statement
		if (SHOW_CREATE_TABLE)
			console.log(sqlStatement);
	
		// running statement
		db.run(sqlStatement);
		
	});
	
	db.close();
}

// swap keys and values
function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}