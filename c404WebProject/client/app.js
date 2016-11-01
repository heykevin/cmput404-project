import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import './stylesheets/main.scss';
import {reducers} from './reducers/index';
import {sagas} from './sagas/index';
import App from './components/App.jsx';
import Home from './pages/Home.jsx';
import UserEdit from './pages/UserEdit.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

import Dashboard from './pages/Dashboard.jsx';
import Post from './pages/Post.jsx';
import MyPosts from './pages/MyPosts.jsx';
import AuthorEdit from './pages/AuthorEdit.jsx'
import EditPost from './pages/EditPost.jsx';
import AddPost from './pages/AddPost.jsx';
import Friends from './pages/Friends.jsx';


// create the store
const sagaMiddleware = createSagaMiddleware();
let middleware = applyMiddleware(routerMiddleware(browserHistory), sagaMiddleware);
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    middleware = compose(middleware, window.devToolsExtension());
}
const store = createStore(reducers, middleware);
const history = syncHistoryWithStore(browserHistory, store);
sagaMiddleware.run(sagas);

function checkAuth(nextState, replace) {

    let loggedIn = sessionStorage.token;
    if (!loggedIn) {
        replace('/');
    } else if (nextState.location.state && nextState.location.pathname) {
        replace(nextState.location.pathname)
    }
}

ReactDOM.render(
    <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/post/*" component={Post}/>
            <Route onEnter={checkAuth}>
                <Router path="/addpost" component={AddPost}/>
                <Router path="/editpost" component={EditPost}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/myposts" component={MyPosts}/>
                <Route path="/settings" component={AuthorEdit}/>
                <Route path="/friends*" component={Friends}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
</Provider>, document.getElementById('app'));
