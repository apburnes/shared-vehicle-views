#! /bin/bash

BUCKET=$1
APIKEY=$2
LAT=38.900462
LON=-77.032112

serverless remove \
    --apikey $APIKEY \
    --place dc \
    --dataType shared-vehicle \
    --bucket $BUCKET
    --location "{\"lon\":$LON,\"lat\":$LAT}"