FROM node:16.16.0

ENV APP_ROOT /app

# Create server directory
WORKDIR $APP_ROOT


# Install server dependencies
# COPY package.json .
# For npm@5 or later, copy package-lock.json as well
COPY package.json yarn.lock ./

# RUN apt-get update -y && apt-get upgrade -y
RUN yarn
# Bundle server source
COPY . $APP_ROOT

EXPOSE 3000 3001

RUN yarn build

CMD [ "yarn", "run", "migrate_and_start_prod"]