FROM nginxinc/nginx-unprivileged:1.23.1-alpine

ADD server.nginx /etc/nginx/conf.d/app.conf.template
COPY build /usr/share/nginx/html
# Create gzipped versions of the static assets
USER root
RUN gzip -k /usr/share/nginx/html/1/*
# Back to nginx user
USER 101

ADD start-server.sh ./start-server.sh

EXPOSE 8080

# using bash over sh for betterssignal-handling
CMD sh /start-server.sh          
