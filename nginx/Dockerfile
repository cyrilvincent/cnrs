FROM nginx:alpine

MAINTAINER Sanjiv Kumar "mr.san.kumar@gmail.com"

# Copy custom nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
EXPOSE 5000 5000

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]