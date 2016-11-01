if ["$NODE_ENV" == "true"]; then
    node client/server.js
else
    gunicorn c404WebProject.wsgi --log-file -
fi
