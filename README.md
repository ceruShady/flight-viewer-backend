# flight-viewer-backend

## Description

This project creates a backend application using Node.js with Express.js framework to provide API endpoint for flight plan information

# Endpoints

## /api/flightplan/list

This endpoint sends an array of flight plan information necessary for displaying a list of flight plans for selection.

#### Query

search (Default value: ""): Defines that aircraft indentification to filter the list with

page (Default value: 1): Defines the page of records to send

perpage (Default value: 10): Defines the amount of records to send

## /api/flightplan/plan/:fid

This endpoint sends an array of objects consisting designated point and coordinates of the flight route for the selected flight plan

#### Params

fid: The id of the flight plan to retrieve the flight route
