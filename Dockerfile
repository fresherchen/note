FROM edu.lxpt.cn/notemicroservices-tpl:latest

# copy note micro services 
COPY src ${APP_DIR}

RUN echo $(pwd)  && \
    echo $(ls) && \
    mv src/* ${APP_DIR}/ && \
	rm -rf src && \
 	echo '++++++++++++++++++' && \
    echo $(pwd)  && \
    echo $(ls)   && \
    echo '_________________'