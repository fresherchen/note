#
# AUTHOR            Jpchen <jpchen@leadstec.com>
# DOCKER-VERSION    1.7.1
# Copyright         (C) 2015 Leads Technologies Ltd. All rights reserved.
#
# Description       Dockerfile for NotesMicroServices image base on nodejs
#
FROM       reg.leadstec.com/nodejs:latest
MAINTAINER Jpchen <jpchen@leadstec.com>

# clone code 
RUN git clone http://jpchen:jinpei0930@git.leadstec.com/jpchen/mic-tpl.git

# install npm packages
RUN cd mic-tpl/src && \
    npm install
	
# log tpl complete
RUN echo 'notes micro servers template is ok' 

# clone code 
ONBUILD git clone http://jpchen:jinpei0930@git.leadstec.com/jpchen/note-microServers.git

# copy node_module
ONBUILD COPY mic-tpl/src/node_modules note-microServers/src

# rm files
# ONBUILD RUN rm mic-tpl
