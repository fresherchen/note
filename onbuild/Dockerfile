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

# mv npm packages
RUN cd mic-tpl && \
    tar -zxvf node_modules.tar.gz && \
	mv node_modules src && \
	rm -rf node_modules.tar.gz
	
# log tpl complete
RUN echo 'notes micro services template is ok' 

# clone code 
ONBUILD RUN git clone http://jpchen:jinpei0930@git.leadstec.com/jpchen/mic-services.git

# copy node_module
ONBUILD RUN cp -r mic-tpl/src/node_modules/ mic-services/src/ && \
        rm -rf mic-tpl