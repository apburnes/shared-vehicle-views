create extension postgis;
create extension "uuid-ossp";

create table shared_vehicles (
	id uuid primary key default uuid_generate_v4(),
	vehicle_id varchar,
    name varchar,
	last_reported timestamp,
    location_id varchar,
    location_type varchar,
    system_id varchar,
    num_docks_available integer default null,
    num_bikes_available integer default null,
    manual_bike integer default 0,
    pedal_assist_bike integer default 0,
    electric_scooter integer default 0,
    collected_at timestamp,
	lon double precision,
	lat double precision,
	geom geometry(point, 3857)
);

create index shared_vehicles_id_idx on shared_vehicles (id);
create index shared_vehicles_collected_at_idx on shared_vehicles (collected_at);
create index shared_vehicles_last_reported_idx on shared_vehicles (last_reported);
create index shared_vehicles_location_type_idx on shared_vehicles (location_type);
create index shared_vehicles_manual_bike_idx on shared_vehicles (manual_bike);
create index shared_vehicles_pedal_assist_bike_idx on shared_vehicles (pedal_assist_bike);
create index shared_vehicles_electric_scooter_idx on shared_vehicles (electric_scooter);
create index shared_vehicles_geom_idx on shared_vehicles using gist(geom);

create or replace function transform_shared_vehicles_geom() returns trigger as $shared_vehicles_geom$
	begin
		if (NEW.lat is not null and NEW.lon is not null) then
			NEW.geom := st_transform(st_setsrid(st_makepoint(NEW.lon, NEW.lat), 4326), 3857);
			return NEW;
		end if;
		return null;
	end;
$shared_vehicles_geom$ language plpgsql;

create trigger shared_vehicles_geom
	before insert or update on shared_vehicles
	for each row execute procedure transform_shared_vehicles_geom();