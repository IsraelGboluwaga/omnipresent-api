# Omnipresent Country Info API


This is the backend repository for the Omnipresent employees country information service.

The entrypoint to the application is contained within the `setup/www.ts` file. Unless specified otherwise, the application will run on port `3030`.


## Install

    yarn install

## Run the app in development

    yarn dev

## Run the tests

    yarn test

# REST API

The REST API to the application is described below.

## Get Health of Application

### Request

`GET /`

    curl -i -H 'Accept: application/json' http://localhost:3030/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 19

    { "message": "ok" }

## POST /employees/country

*Note: More than one json object can be passed into the "list" array*
### Request

`POST /employees/country`

    curl -i -H 'Accept: application/json' -d 'list=[{"firstName":"Roy","lastName":"Testerton","dateOfBirth":"19/02/1990","jobTitle":"Software developer","company":"Test co","country":"US"}]' http://localhost:3030/employees/country


### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /employees/country
    Content-Length: 415

    {"status":"true","data":[{"firstName": "Roy","lastName": "Testerton","dateOfBirth": "19/02/1990","jobTitle": "Software developer","company": "Test co","country": "US","countryInfo": {"fullName": "United States of America","currency": "USD","timezones": ["UTC-12:00","UTC-11:00","UTC-10:00","UTC-09:00","UTC-08:00","UTC-07:00","UTC-06:00","UTC-05:00","UTC-04:00","UTC+10:00","UTC+12:00"],"languages": ["English"]}}]}


## Why the return data is structured on the resulting employee object this way
Due to the fact that the data could potentially be duplicated (people can have the same names, job titles and companies), it was reasonable to return the entire employee information with the additional country information.
