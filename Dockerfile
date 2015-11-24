FROM edu.lxpt.cn/notemicroservices-tpl:latest

# mv note micro services 
RUN	mv mic-services/src/* ${APP_DIR}/ && \
	rm -rf src
