import React from 'react';
import {connect} from 'react-redux';
import {ProgressBar} from 'react-bootstrap';
import {browserHistory} from 'react-router';
import PostListElement from '../components/PostListElement.jsx';

export class Post extends React.Component
{
    constructor(props)
    {
        super(props);
        console.dir(props);
        let path = this.props.params.splat || "",
            pathElements = path.split("/"),
            id,
            comments;
        this.state = {
            posts: []
        }
        
        if (pathElements.length > 0 && pathElements[0]) {
            id = pathElements[0];
            comments = pathElements.length > 1 && pathElements[1].toLowerCase() === "comments"
                ? true
                : false;
            this.props.dispatch({type: 'postsGetPosts', method: "post", postId: Number(id), comments: comments});
        } else {

            // needs to be improved once we find a way to properly record log in session data
            let redirectUrl = sessionStorage.loggedIn ? "/dashboard" : "/";
            browserHistory.push(redirectUrl);
        }
    }

    render()
    {
        if (this.props.posts.length === 1) {
            let post = this.props.posts[0];
            return (
                <div className="list-group">
                    <PostListElement key={post.id} id={post.id} view="view"/>
                </div>
            );
        } else {
            return (<ProgressBar active now={100}/>);
        }
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        posts: state.posts.list || []
    };
}
export default connect(mapStateToProps)(Post);
