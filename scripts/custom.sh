#!/bin/bash

set -e

# sync with linked database every restart
if [[ -n "DB_PORT_27017_TCP_ADDR}" ]]; then
    sudo -u node -H sed -ri "s|mongodb://.*|mongodb://${DB_PORT_27017_TCP_ADDR}/${NOTES_DBNAME}',|g" ${APP_DIR}/config/env/${NODE_ENV}.js

  if [[ -e ${APP_DIR}/config/env/local.js ]]; then
        sudo -u node -H sed -ri "s|mongodb://.*|mongodb://${DB_PORT_27017_TCP_ADDR}/${NOTES_DBNAME}',|g" ${APP_DIR}/config/env/local.js
    fi
fi

# setup the note microservices
cd ${APP_DIR}/
grunt
