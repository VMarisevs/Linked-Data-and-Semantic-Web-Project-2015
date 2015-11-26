## Linked Data and Semantic Web Project 2015

**Due: November 18th 2015**

## Introduction

In my API I have selected few datasets from [data.gov.ie](https://data.gov.ie/data). These datasets contains information about car parks and parking meters in Galway (x,y coordinates, size of car park). But because this datasets are small, I have an idea to make a *.json* reader, that contains config file, where administrator can define any pluggable dataset. I will try to concentrate mostly on geographic data to be plugged in. 
**./data/config.json** file will contain metadata information about *.json* files that are in **./data/datasets** folder.
**./etc/config.js** has global information. Also contains some variables, that allows administrator to turn on/off notifications in console.

## Datasets used

> - [**Car park in Galway**](https://data.gov.ie/dataset/galway-city-car-parking-locations)
> - [**Parking meters in Galway**](https://data.gov.ie/dataset/galway-city-parking-meter-locations)
> - [**Parks in Galway**](https://data.gov.ie/dataset/parks-in-galway-city)

## Example use of the API

- Application can be used to search for a closest car park (more records could be added into json file to cover not just Galway area).
- Application also can search for a closest park meter (because there was small dataset, it could be expanded).
- User also could search for a park based on his location.
- Administrator would be able to switch json data to make this API universal.(but by default I will use 3 datasets, and all tests will be based on them).

## How to Query the API



- [http://localhost:8000/](http://localhost:8000/) *This is API's metadata. Can be runned in browser*

- [http://localhost:8000/GalwayCity_OpenData_CarParking](http://localhost:8000/GalwayCity_OpenData_CarParking) *This query shows all data in this table.*

```text
$ curl.exe -X GET http://localhost:8000/
```
*Curl command to get metadata. This is whole data that is loaded from config.json file.*

```text
$ curl.exe -X GET http://localhost:8000/GalwayCity_OpenData_CarParking
```
- *Curl command to get whole record set for one of the default tables.*

```text
$ curl.exe -X GET http://localhost:8000/GalwayCity_OpenData_CarParking/3
```
- *Curl command that shows one record from whole dataset.*

```text
$ curl.exe -X PUT --data "x=1&y=2&name=new Record&type=some Type&no_spaces=200&lat=12&long=33&eastitm=32&northitm=22&eastig=321&northig=432" http://localhost:8000/GalwayCity_OpenData_CarParking/insert
```
- *Curl command that inserts new record into default database. In case row is inserted, returns "ok" as response.*

```text
$ curl.exe -X POST --data "{\"id\":\"1\",\"x\":\"0.05\",\"y\":\"-0.05\",\"name\":\"update works\"}" http://localhost:8000/GalwayCity_OpenData_CarParking/update
```
- *Curl command that updates the record based on provided record id. Returns rows changed. In case non existing id entered, will return 0, else will return 1, because sql statement won't allow to change more than 1 row.*

```text
$ curl.exe -X DELETE --data "id=35" http://localhost:8000/GalwayCity_OpenData_CarParking/delete
```
- *Curl command that deletes record based on provided id. Returns rows affected as a response. Id is important to run this query, in case no id entered, it won't let you truncate the table. User is allowed to remove 1 record at execution time.*



## File structure


**./runner.js** *- this is a main runner file*

**./etc/** *- this folder contains all scripts that* **Node js** *server is running.*

> - **./etc/service.js** 
>*- this file starts up the server. Runs scripts to load databases, init routes and configurations.*

> - **./etc/config.js** 
>*- configurable constats for this API.*

> - **./etc/routes.js** 
>*- this file dynamically generates routes per each dataset, that is defined in* **config.json**.

> - **./etc/initdb.js** 
>*- this is a file where in future we can define other database engines. To allow administrator to choose another* **DBMS**.

> - **./etc/sqlite3db.js** 
>*- this file generates and executes queries. All queries are dynamic and happens on the fly. When* **initdb.js** *requests to initialize database with* **SQLite3** *standards. It generates a binary file with* **.sqlite3** *type in* **./data/bin/** *folder. And automatically inserts all data from* **.json** *file. If the file exists, it won't override it.*

> - **./etc/get-record.js** ; **./etc/get-records.js** ; **./etc/put-record.js** ; **./etc/post-update.js** ; **./etc/delete-record.js**
>*- this files are responsible for request navigation. When user access one of these routes, it will identify the database type and navigates request to correct database connection file.*

**./data/** *- this is data folder, where administrator can configure their datasets.*

> - **./data/config.json**
>*- this file contains information about all imported datasets. If dataset isn't defined in this file, API won't recognize it.*

> - **./data/bin/** 
>*- this is a folder with binary files, that are generated by DBMS to store data. Note that if database file exists in this folder and it has > 1 row. API won't override it. Application is configured so if there is no file it will generate new one and if there is no records, will insert from provided dataset.*

> - **./data/datasets/** 
>*- this folder contains all user provided datasets. Because API is designed very dynamic way, user easy can plug in any other datasets. And to let API know about new dataset, just insert file name and small description into* **./data/config.json**.


## References

- [Package.json example](http://browsenpm.org/package.json)
- [Git cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
- [SQLite3 commands](http://blog.modulus.io/nodejs-and-sqlite)
- [Dividing all functions into separate files](http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
- [Swap keys and values in JavaScript array](http://stackoverflow.com/questions/23013573/swap-key-with-value-json) *used in ./etc/sqlite3db.js*
- [Good practice of SQLite3](https://github.com/WebReflection/dblite) *used in ./etc/sqlite3db.js for inserting record set*
- [Size of object](http://vancelucas.com/blog/count-the-number-of-object-keysproperties-in-nodejs/)
- [Pouch db functions](http://pouchdb.com/api.html)

#### Code borrowed

I was looking for a fast way of swap keys and values, and found a solution, that I have used in my API. Whole solution is [here](http://stackoverflow.com/questions/23013573/swap-key-with-value-json) and I have used this code in *./etc/initdb.js*

```js
// swap keys and values
	function swap(json){
		var ret = {};
		for(var key in json){
			ret[json[key]] = key;
		}
		return ret;
	}
```
