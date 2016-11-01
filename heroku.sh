echo $NODE_ENV
if ["$NODE_ENV" == "true"]; then
    echo "Starting node server"
    node client/server.js
else
    echo "starting django app"
    gunicorn c404WebProject.wsgi --log-file -
fi
