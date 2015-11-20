FROM edu.lxpt.cn/notemicroservices-tpl:latest

# copy note micro services 
COPY src/* ${APP_DIR}/ && \
echo '11111111111111111111111111111111111111111111'
echo $(pwd) && \
echo $(ls) && \
echo '11111111111111111111111111111111111111111111'
