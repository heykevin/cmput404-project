#!/bin/bash
echo Building API ------------------------------
git remote add api https://git.heroku.com/api-returnoftheblog.git
heroku buildpacks:set heroku/python --remote api
git commit --allow-empty -m "Deploying api"
git push --force api master
heroku run python manage.py migrate --remote api

echo Building Client -----------------------------
npm install
npm run build-prod
git remote add client https://git.heroku.com/returnoftheblog.git
heroku buildpacks:set heroku/nodejs --remote client
git add client
git commit --allow-empty -m "Deploying Client"
git push --force client master

heroku ps:scale web=1 --app returnoftheblog
heroku ps:scale web=1 --app api-returnoftheblog
