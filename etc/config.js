
// application server port number
GLOBAL.SERVICE_PORT = 8000;

// global config path
GLOBAL.CONFIG_FILE = "./data/config.json";
/*
 *	WARN Array that contains information about databases
 */

 GLOBAL.DATABASES;
 
/*
 *	file types
 */
 
// sqlite3 binary files`
GLOBAL.SQLITE3_BIN_TYPE = ".sqlite3";

// pouch db folder
GLOBAL.POUCHDB_PARENT_FOLDER = "pouch/";

/*
 *	global folder structure
 */
 
// database binary files
GLOBAL.BIN_FOLDER = "./data/bin/";

// datasets .json files
GLOBAL.DATASET_FOLDER = "./data/datasets/";

/*
 *	console notifications
 */

// create table statements in console
GLOBAL.SHOW_CREATE_TABLE = false;

// show insert statements in console
GLOBAL.SHOW_INSERT_INTO_TABLE = false;

// show record updates in console
GLOBAL.SHOW_RECORD_UPDATES = false;

// show delete record statement in console
GLOBAL.SHOW_DELETE_RECORD = false;

// show requested records in console
GLOBAL.SHOW_REQUESTED_RECORDS = false;