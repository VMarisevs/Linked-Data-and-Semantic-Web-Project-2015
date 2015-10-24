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


## References