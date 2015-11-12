#!/bin/bash

# call nodejs image's runonce_nodejs script
source /scripts/runonce_nodejs.sh
runonce_nodejs

STACK_TITLE=${STACK_TITLE:-NotesMicroServices}
STACK_DESC=${STACK_DESC:-$STACK_TITLE}
NOTES_DBNAME=${NOTES_DBNAME:-notesmicroservices}
NOTES_SESSION_SECRET=${STACK_SESSION_SECRET:-$NOTES_DBNAME}
NODE_ENV=${NODE_ENV:-development}
# get db user info from linked container
NOTES_DBUSER=${DB_ENV_DBUSER:-}
NOTES_DBPASS=${DB_ENV_DBPASS:-}

#
# Stack setup
#
runonce_noteservices() {
    # AppStack main configs
    printf "Configuring AppStack basis settings ... "
    sudo -u node -H sed -i "s/{{STACK_TITLE}}/${STACK_TITLE}/" ${APP_DIR}/config/env/default.js
    sudo -u node -H sed -i "s/{{STACK_DESC}}/${STACK_DESC}/" ${APP_DIR}/config/env/default.js
    sudo -u node -H sed -i "s/{{NOTES_SESSION_SECRET}}/${NOTES_SESSION_SECRET}/" ${APP_DIR}/config/env/default.js
    # db configs
    if [[ -n "DB_PORT_27017_TCP_ADDR}" ]]; then
        sudo -u node -H sed -i "s/{{STACK_DBHOST}}/${DB_PORT_27017_TCP_ADDR}/" ${APP_DIR}/config/env/${NODE_ENV}.js
        # local.example.js
        sudo -u node -H sed -i "s/{{STACK_DBHOST}}/${DB_PORT_27017_TCP_ADDR}/" ${APP_DIR}/config/env/local.example.js
    fi
    sudo -u node -H sed -i "s/{{NOTES_DBNAME}}/${NOTES_DBNAME}/" ${APP_DIR}/config/env/${NODE_ENV}.js
    sudo -u node -H sed -i "s/{{NOTES_DBUSER}}/${NOTES_DBUSER}/" ${APP_DIR}/config/env/${NODE_ENV}.js
    sudo -u node -H sed -i "s/{{NOTES_DBPASS}}/${NOTES_DBPASS}/" ${APP_DIR}/config/env/${NODE_ENV}.js
    # local.example.js
    sudo -u node -H sed -i "s/{{NOTES_DBNAME}}/${NOTES_DBNAME}/" ${APP_DIR}/config/env/local.example.js
    sudo -u node -H sed -i "s/{{NOTES_DBUSER}}/${NOTES_DBUSER}/" ${APP_DIR}/config/env/local.example.js
    sudo -u node -H sed -i "s/{{NOTES_DBPASS}}/${NOTES_DBPASS}/" ${APP_DIR}/config/env/local.example.js

    printf "${green}OK\n${end}"

    echo "Initialization for stack image completed !!!"
}
