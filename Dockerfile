FROM edu.lxpt.cn/notemicroservices-tpl:latest

RUN chown -R node:node ${APP_DIR} 

# copy note micro services 
COPY src ${APP_DIR} && \
	mv ${APP_DIR}/src/* ${APP_DIR}/ && \
 	echo '++++++++++++++++++' && \
    echo $(pwd)  && \
    echo $(ls)   && \
    echo '_________________'
