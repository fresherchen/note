#
# AUTHOR            Jpchen <jpchen@leadstec.com>
# DOCKER-VERSION    1.9.1
# Copyright         (C) 2016 Leads Technologies Ltd. All rights reserved.
#
# Description       Dockerfile for Notes Service image base on nodejs
#
FROM  backend_nodejs_ms:latest
MAINTAINER Jpchen <jpchen@leadstec.com>
LABEL leadstec-notes-build="0.2.0-{{PIPELINE_BUILD_NUMBER}}"

# set environment variables
ENV NOTES_VERSION="0.2.0"

# install packages
RUN apk --update add make git nodejs && \
    rm /var/cache/apk/*

# add metadate custom & runonce scripts
COPY scripts /scripts
RUN bash /scripts/setup/install
RUN rm -fr /scripts/setup

# copy code
COPY src ${APP_DIR}
