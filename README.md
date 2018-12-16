shared-vehicle-views
=============

Capture and analyze the movement of shared vehicles (bike share, dockless bikes, scooters) by exploring the Washington, DC shared vehicles.

## About

The data is accessible through [Coord's API](https://coord.co/docs/sv) and snapshots of the available shared vehicles are requested every 15 minutes within 20km of central DC.  After collecting a sample set of data over a period of days and weeks, we'll identify hotspots and activity by time and day.

## PreReqs

- Node `v8.10` is the runtime
- The `serverless` CLI is availble to deploy the function to AWS
  - To install `npm install -g serverless`
- AWS Credentials
  - Set `$AWS_ACCESS_KEY_ID` & `$AWS_SECRET_ACCESS_KEY` environment variables

## Getting Started

First [sign up with Coord](https://coord.co/) to get access to an API Key. Run `npm install` to install the dependencies needed to run the function. Now you can run the function locally.

## Invoking the Capture Function Locally

The `capture` function will make a API request to find all of the shared vehicle locations in DC and then save the JSON response into S3. The S3 location will be `s3://<your bucket name>/shared-vehicle/dc/<requested json data>.json`.

```bash
# Testing locally to capture Washington DC shared vehicle data

$> serverless invoke local \
    -f capture \
    --apikey <your api key> \
    --place dc \
    --dataType shared-vehicle \
    --bucket <your bucket name> \
    --location "{\"lon\":$LON,\"lat\":$LAT}"
```

## Deploying the Service

After testing the functions locally, you will deploy to function to AWS Lambda.  The function is set to be deployed into the `us-west-2` region.

```bash
# Deploying the service for shared vehicle data

$> serverless deploy \
    --apikey <your api key>
    --place dc \
    --dataType shared-vehicle \
    --bucket <your bucket name>
    --location "{\"lon\":-77.032112,\"lat\":38.900462}"
```

## Teardown the Service

To remove all the lambda functions, logs, and permisions associated with this service.

**Note** - The json data saved into the S3 bucket will _NOT_ be removed or deleted from S3 when the service is torndown

```bash
# Teardown the service for shared vehicle data

$> serverless remove \
    --apikey <your api key>
    --place dc \
    --dataType shared-vehicle \
    --bucket <your bucket name>
    --location "{\"lon\":-77.032112,\"lat\":38.900462}"
```

## Contact

Andrew Burnes