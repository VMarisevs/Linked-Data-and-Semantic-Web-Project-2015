## Linked Data and Semantic Web Project 2015

**Due: November 18th 2015**

## Introduction

In my API I have selected few datasets from [data.gov.ie](https://data.gov.ie/data). These datasets contains information about car parks and parking meters in Galway (x,y coordinates, size of car park). But because this datasets are small, I have an idea to make a json reader, that contains config file, where administrator can define any pluggable dataset. I will try to concentrate mostly on geographic data to be plugged in. Config file also will contain information if there is a separate file with metadata and what kind of database type user want to store data.

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

## File structure

> - **./runner.js** *- this is a main runner file*
> - **./etc/config.js** *- configurable constats for this application*
> - **./etc/service.js** *- server runner *

## References

- [Package.json example](http://browsenpm.org/package.json)
- [Git cheat sheet](https://training.github.com/kit/downloads/github-git-cheat-sheet.pdf)
- [SQLite3 commands](http://blog.modulus.io/nodejs-and-sqlite)
- [Dividing all functions into separate files](http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files)
- [Swap keys and values in JavaScript array](http://stackoverflow.com/questions/23013573/swap-key-with-value-json) *used in ./etc/sqlite3db.js*
- [Good practice of SQLite3](https://github.com/WebReflection/dblite) *used in ./etc/sqlite3db.js for inserting record set*
- [Size of object](http://vancelucas.com/blog/count-the-number-of-object-keysproperties-in-nodejs/)