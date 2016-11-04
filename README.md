# cmput404-project

This is a temporary README for a group project of CMPUT404.

## Setting up
### Backend
> virtualenv venv  
> source venv/bin/activate  
> pip install -r requirements.txt  
> python manage.py runserver

### Frontend
Requires NodeJS 4.0.0 and above

In the terminal run:
> npm install  
> npm start  

visit localhost:8080 when bundle is built

## Deploying
Make sure you do not have any local commits or unstaged changes before deploying!
Simply run
> heroku login  
> ./deploy.sh  

And the script should take care of the rest

Hosted at:

https://api-bloggyblog404.herokuapp.com/

https://bloggyblog404.herokuapp.com/

### Libraries used
- Built off the [redux-minimal] starter kit
- Front end Libraries
- Back end Libraries

### Authors
`Alice Wu, Josh (Ji Hwan) Kim, Kevin Tang, Philip Lam, and Xuping Fang`

### License 
This project is licensed under the MIT license, Copyright 2016 Alice Wu, Josh (Ji Hwan) Kim, Kevin Tang, Philip Lam, and Xuping Fang 
