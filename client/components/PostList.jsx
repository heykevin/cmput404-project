import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, List, ListGroup} from 'react-bootstrap';

import PostListElement from './PostListElement.jsx';
import Utils from '../utils/utils.js';

export class PostList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            posts: []
        }

        // posts can be retrieve by either author/{AUTHOR_ID}/posts or posts
        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: Utils.getAuthor().id});
        this.props.dispatch({type: 'posts.reloadList'});
        if (this.props.foreign) {
            this.props.dispatch({type: 'postsGetForeignPosts', method: this.props.method, page: this.props.page || ""});
        } else {
            this.props.dispatch({type: 'postsGetPosts', method: this.props.method, authorId: this.props.authorId, page: this.props.page || ""});
        }
    }

    render()
    {
        let start_count = 0, posts, resolved, count;
        if (this.props.foreign) {
            posts = this.props.foreignPosts;
            resolved = this.props.foreignResolved;
            count = this.props.foreignCount;
        } else {
            posts = this.props.posts;
            resolved = this.props.resolved;
            count = this.props.count;
        }

        console.dir(this.props);

        // render
        if (!resolved || !this.props.authorResolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else if (posts.length && this.props.authorResolved) {
            return (
                <div>
                    <div className={(this.props.sending ? "visible" : "invisible") + " hide-yall-kids-hide-yall-wife"}>
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <ListGroup className="post-group">
                        {posts.map((post, index) => {
                            if (index >= 0 && index < posts.length) {
                                return (<PostListElement key={post.id} id={post.id} preview={true} foreign={this.props.foreign} canEdit={this.props.canEdit}/>);
                            }
                        })}
                    </ListGroup>
                </div>
            );
        } else {
            return (
                <div className="no-posts">
                    <div className="warning-text">
                        You currently do not have any posts. <br/>
                        Click <a href="/addpost">Add Post</a> to make a new post!
                    </div>
                </div>
            );
        }
    }
}

// export the connected class
function mapStateToProps(state, own_props) {
    console.log(state.routing.locationBeforeTransitions.query);
    return {
        posts: state.posts.list || [],
        foreignPosts: state.posts.foreignList || [],
        resolved: state.posts.resolved || false,
        foreignResolved: state.posts.foreignResolved || false,
        count: state.posts.count,
        foreignCount: state.posts.foreignCount,
        sending: state.users.sending,
        method: own_props.method,
        authorId: own_props.authorId,
        foreign: own_props.foreign,
        authorResolved: state.users.authorResolved,
    };
}
export default connect(mapStateToProps)(PostList);
