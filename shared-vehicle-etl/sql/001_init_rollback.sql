drop trigger shared_vehicles_geom on shared_vehicles;
drop function transform_shared_vehicles_geom();
drop table shared_vehicles cascade;
drop extension postgis;
drop extension "uuid-ossp";