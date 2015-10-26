/* 
 *	npm module loader
 */
 
// Import express to create and configure the HTTP server.
var express = require('express');
var app = express();

/*
 *	Allows to access public folder while server running
 */
	var path = __dirname.slice(0,__dirname.length-4);
	app.use(express.static(path + "/public"));
	
	
/*
 *	Loading configuration file
 */
	console.log("Loading Config file...");
	require('./config.js');

/*
 *	Loading db
 */
	var initdb = require('./initdb.js');
	initdb.DatabaseInit();
	
/*
 *	Defining routes
 */	
	var routes = require('./routes.js');
	routes.DefineRoutes(app, express);

	
	
/*
 * Starting the server
 */
	var server = app.listen(SERVICE_PORT, function(err){
		if (!err)
			console.log("Server is successfully loaded...");
	});
	