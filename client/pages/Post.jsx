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
            this.props.dispatch({type: 'postsGetPosts', method: "post", postId: id, comments: comments});
        }
    }

    render()
    {
        if (this.props.post && this.props.resolved) {
            return (
                <div className="list-group post-group">
                    <PostListElement key={this.props.post.id} id={this.props.post.id} view="view"/>
                </div>
            );
        } else if (!this.props.resolved) {
            return (<ProgressBar active now={100}/>);
        }
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        post: state.posts.list || [],
        resolved: state.posts.resolved || false
    };
}
export default connect(mapStateToProps)(Post);
