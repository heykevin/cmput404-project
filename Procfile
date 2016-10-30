migrate: python manage.py migrate
gun: gunicorn c404WebProject.wsgi --log-file -
api: python manage.py runserver 0.0.0.0:$PORT
web: npm start
