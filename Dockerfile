FROM nginx:stable
MAINTAINER kerker <yes-reply@linux.com>
#https://hub.docker.com/_/nginx/

EXPOSE 80
ENV NODE_ENV test

ADD . /tmp/
RUN cp -r /tmp/dist/* /home/ \
  && cp /tmp/nginx.conf /etc/nginx/nginx.conf \
  && rm -rf /tmp/*




CMD ["nginx", "-g", "daemon off;"]
