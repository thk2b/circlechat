FROM nginx:1.12-alpine
# ADD /nginx.conf /etc/nginx/nginx.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]