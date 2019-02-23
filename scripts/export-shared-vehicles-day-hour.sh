#! /bin/bash

EXPORTDIR=$1

day=1
hour=0

while [ "$day" -lt 8 ]    # this is loop1
do
    while [ "$hour" -lt 24 ]  # this is loop2
    do
        if [ "$hour" -lt 10 ]; then
            outhour="0$hour"
        else
            outhour="$hour"
        fi

        outputfile=$EXPORTDIR"free-floating-day$day-hour$outhour.csv"

        psql shared_vehicles -c "
            copy
            (
                select
                    vehicle_id,
                    name,
                    last_reported at time zone 'US/Eastern' as last_reported,
                    system_id,
                    case
                        when manual_bike::integer = 1 then 'manual-bike'
                        when pedal_assist_bike::integer = 1 then 'pedal-assist-bike'
                        when electric_scooter::integer = 1 then 'electric-scooter'
                        else 'unkown'
                    end as vehicle_type,
                    collected_at at time zone 'US/Eastern' as collected_at,
                    lon,
                    lat
                from
                    shared_vehicles
                where
                    location_type = 'free_floating' and
                    last_reported > collected_at - interval '15 minutes' and
                    extract(isodow from last_reported at time zone 'US/Eastern') = $day and
                    extract(hour from last_reported at time zone 'US/Eastern') = $hour
            )
            to '$outputfile'
            with csv delimiter ',' header;
        "
        hour=`expr $hour + 1`
    done
    day=`expr $day + 1`
    hour=0
done