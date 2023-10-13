FROM nginxinc/nginx-unprivileged:stable-alpine-slim

ADD server.nginx /etc/nginx/conf.d/app.conf.template
COPY build /usr/share/nginx/html
ADD start-server.sh ./start-server.sh

EXPOSE 8080

# using bash over sh for betterssignal-handling
CMD sh /start-server.sh          
