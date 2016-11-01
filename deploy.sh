#!/bin/bash
echo Building API
git remote add api https://git.heroku.com/bloggyblog404.git
heroku buildpacks:set heroku/python --remote api
git commit --allow-empty -m "Deploying"
git push api master
heroku run python manage.py migrate --remote api

echo Building Client
npm install
npm build-prod
git remote add client https://git.heroku.com/api-bloggyblog404.git
heroku buildpacks:set heroku/nodejs --remote client
git add client
git commit --allow-empty -m "Deploying"
git push client master

heroku ps:scale web=1 --app bloggyblog404
heroku ps:scale web=1 --app api-bloggyblog404
