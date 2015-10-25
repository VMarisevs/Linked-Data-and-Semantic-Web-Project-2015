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
 * Starting the server
 */
	var server = app.listen(SERVICE_PORT);
	console.log("Server is successfully loaded...");