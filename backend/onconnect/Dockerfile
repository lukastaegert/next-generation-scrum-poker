FROM amazon/aws-lambda-nodejs:14
ENV AWS_REGION=eu-central-1
COPY build/app.js ./
CMD [ "app.lambdaHandler" ]
