/* 
 *	npm module loader
 */
 
// Import express to create and configure the HTTP server.
var express = require('express');
var app = express();

/*
 *	Loading configuration file
 */
	console.log("Loading Config file...");
	require('./config.js');

/*
 *	Loading db
 */
 
	console.log("Loading Db files...");
	require('./initdb.js');
	
/*
 * Starting the server
 */
	var server = app.listen(SERVICE_PORT, function(err){
		if (!err)
			console.log("Server is successfully loaded...");
	});
	