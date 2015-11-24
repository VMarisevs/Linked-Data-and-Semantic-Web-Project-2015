## Introduction
I have build an API that allows user to plug in their .json formated file in few seconds. This file must be copied into *./data/datasets/simple_dataset.json*. Then to inform API user must configure *./data/config.json* file that contains meta data.

#### Simple example ./data/config.json  
```json
[
	{
		"file" : "simple_dataset.json",
		"name" : "user name"
	},
	{
		"file" : "simple_dataset2.json",
		"name" : "Dataset 2",
		"dbtype" : "pouchdb",
		"columns" : {
			"renamed_column-1" : "column_in_json_1",
			"renamed_column-2" : "column_in_json_2",
			"renamed_column-3" : "column_in_json_3"
		},
	},
]
```
When user plugs in their dataset, they must inform API, simply add a record in */data/config.json*. User can use default settings, by specifying just file name and prefered dataset name (if not will be used as "undefined").
Database type can be defined. At the moment this API can generate sqlite3 and pouchdb, but API design pattern allows to add more database types. By default this option uses sqlite3 database.
Also user can specify new column names as defined in example.

#### Install & Run
```text
$ npm install
$ ...
$ node ./runner.js
```
#### At runtime

At run time API will read all **metadata** from *./data/config.json*. And if *.json file with defined database format doesn't exists, it will create new one and populate database. At the same time it will create special routes for each defined database.

#### API configuration

User can disable notification's in console, change api listening port and few more options in *./etc/config.js*


## Dataset Selection
I have selected 3 datasets, to test this api. But API allows to add more datasets, because of it's dynamic structure. At development time I have planned to implement google map with tagged records, only if they have x and y coordinates (Long & Lat). That's where column renaming comes into play.

## Databases
This API reads data from *.json* file and generates database based on metadata provided by user. At the moment only 2 types of database used **SQLite3** and **PouchDB**. But based on file structure, it can be expanded.
#### SQLite3
When this database is generated, it creates a table based on first provided record in *.json* file. It will recognize a number and defines a column **FLOAT** format and any text columns as **VARCHAR(255)**. It also will specify an autoincrementing primary key.
#### PouchDB
When parsing *.json* into PouchDB it will generate default _id field and _rev. All other columns will be defined as "String".

## Express API
Route | Definition
------|-----------
[http://hosting.api/](http://localhost:8000/) | This route renders *index.ejs* page and displays all data that used in this api. It uses **GET** method.
[http://hosting.api/[database_name]/](http://localhost:8000/GalwayCity_OpenData_CarParking/) | This route displays all records in this database. It uses **GET** method.
[http://hosting.api/[database_name]/[:id]](http://localhost:8000/GalwayCity_OpenData_CarParking/2 ) | This route displays only selected record. It is used in edit form, to retrieve a special record from database. It uses **GET** method and takes id parameter.
[http://hosting.api/[database_name]/insert](http://localhost:8000/GalwayCity_OpenData_CarParking/insert ) | This route inserts a new record into database. It uses **PUT** method.
[http://hosting.api/[database_name]/update](http://localhost:8000/GalwayCity_OpenData_CarParking/update) | This route updates record in database. It uses **POST** method.
[http://hosting.api/[database_name]/delete](http://localhost:8000/GalwayCity_OpenData_CarParking/delete ) | This route deletes record from database. It uses **DELETE** method.

## Front End
At the front end's main page [http://localhost/](http://localhost:8000/) we can views all tables in this api and identify in which format they have been generated (SQLite3 or PouchDB). Then we have [Bootstrap](http://www.w3schools.com/bootstrap/default.asp) navigation bar, that will be generated based on meta data, using database name. All data is represented in table format, and we can do **CRUD** operations.
If table is generated in SQLite3 format and column is defined as *FLOAT*, user can't insert anything else. I am using new type called *number* in HTML5.
#### Edit
When user clicks edit button beside record, it will popup in new dialog and disables the background until user finishes with it. User can save changes or cancel them by clicking "x".
#### Delete
Also user can delete a record. Before api will remove the record, it will ask user for a confimation.
#### Insert
After specifying columns in input boxes, we can insert new record by clicking insert button. It will send a query to api.
#### Extra
All this functions are followed by notification, that are showed at the top of the page for few seconds.

## ERROR 
can't create ./data/bin folder