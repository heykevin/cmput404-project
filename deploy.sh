#!/bin/bash
echo Building API
git remote add api https://git.heroku.com/gentle-hollows-68494.git
git commit --allow-empty -m "Deploying"
git push api master
heroku run python manage.py migrate --remote api

echo Building Client
npm install
npm build-prod
git remote add client https://git.heroku.com/eerie-mansion-58762.git
git add client
git commit --allow-empty -m "Deploying"
git push client master
