#!/bin/sh
cd ../basic/-nodulus-core
npm link

cd ../../nodulus2
npm link @nodulus/core

cd ../basic/-nodulus-config
npm link

cd ../../nodulus2
npm link @nodulus/config


cd ../basic/-nodulus-logs
npm link

cd ../../nodulus2
npm link @nodulus/logs


cd ../basic/-nodulus-api
npm link

cd ../../nodulus2
npm link @nodulus/api

cd ../basic/-nodulus-update
npm link

cd ../../nodulus2
npm link @nodulus/update


cd ../basic/-nodulus-data
npm link

cd ../../nodulus2
npm link @nodulus/data


cd ../basic/-nodulus-data-diskdb
npm link

cd ../../nodulus2
npm link @nodulus/data-diskdb


cd ../basic/-nodulus-data-mongodb
npm link

cd ../../nodulus2
npm link @nodulus/data-mongodb

cd ../basic/-nodulus-data-rethinkdb
npm link

cd ../../nodulus2
npm link @nodulus/data-rethinkdb
