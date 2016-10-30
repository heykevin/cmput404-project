release: python manage.py migrate
web: gunicorn c404WebProject.wsgi --log-file -
web: python manage.py runserver 0.0.0.0:$PORT
web: npm start
