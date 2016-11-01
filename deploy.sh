#!/bin/bash
echo Building API
git remote add api https://gentle-hollows-68494.herokuapp.com/
git commit --allow-empty -m "Deploying"
git push api master
heroku run python manage.py migrate --remote api

echo Building Client
git remote add client https://eerie-mansion-58762.herokuapp.com/
git commit --allow-empty -m "Deploying"
git push client master
