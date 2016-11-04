import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, List, Pagination, ListGroup} from 'react-bootstrap';

import PostListElement from './PostListElement.jsx';

export class PostList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            posts: []
        }

        // posts can be retrieve by either author/{AUTHOR_ID}/posts or posts
        this.props.dispatch({type: 'posts.reloadList'});
        this.props.dispatch({type: 'postsGetPosts', method: this.props.method, authorId: this.props.authorId, page: this.props.page || ""});
        this.changePage = this.changePage.bind(this);
    }

    render()
    {
        // pagination
        const per_page = 10;
        const pages = Math.ceil(this.props.count / per_page);
        const current_page = this.props.page;
        let start_count = 0;
        console.log("changing page ---", this.props.posts);

        // render
        if (!this.props.resolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else if (this.props.posts.length) {
            return (
                <div>
                    <ListGroup className="post-group">
                        {this.props.posts.map((post, index) => {
                            if (index >= 0 && start_count < per_page) {
                                start_count++;
                                return (<PostListElement key={post.id} id={post.id} preview={true} canEdit={this.props.canEdit}/>);
                            }
                        })}
                    </ListGroup>
                    <Pagination className="users-pagination pull-right" bsSize="medium" maxButtons={10} first last next prev boundaryLinks items={pages} activePage={current_page} onSelect={this.changePage}/>
                </div>
            );
        } else {
            return (
                <div className="no-posts">
                    <div className="warning-text">
                        You currently do not have any posts available to read. <br/>
                        Click <a href="/addpost">Add Post</a> to make a new post!
                    </div>
                </div>
            );
        }
    }

    changePage(page)
    {
        console.log("changing page ---", this.props.nextUrl);
        console.dir(this.props);
        this.props.dispatch({type: 'posts.reloadList'});
        this.props.dispatch(push(this.props.path+'?page=' + page));
        this.props.dispatch({type: 'postsGetPosts', method: this.props.method, authorId: this.props.authorId, page: page});
    }
}

// export the connected class
function mapStateToProps(state, own_props) {
    console.log(state.routing.locationBeforeTransitions.query);
    return {
        posts: state.posts.list || [],
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1,
        path: state.routing.locationBeforeTransitions.pathname,
        resolved: state.posts.resolved || false,
        count: state.posts.count,
        method: own_props.method,
        authorId: own_props.authorId
    };
}
export default connect(mapStateToProps)(PostList);
