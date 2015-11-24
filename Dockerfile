FROM edu.lxpt.cn/notemicroservices-tpl:latest

# copy note micro services
RUN echo $(pwd)  && \
    echo $(ls) && \
    echo '_________________'
COPY src/* ${APP_DIR}/ && \
	echo $(pwd)  && \
    echo $(ls)