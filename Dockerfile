FROM edu.lxpt.cn/notemicroservices-tpl:latest

# copy note micro services 
COPY src/* ${APP_DIR}/  && \
RUN chown -R node:node ${APP_DIR}