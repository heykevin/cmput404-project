import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, List, ListGroup, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

import PostListElement from './PostListElement.jsx';
import Utils from '../utils/utils.js';

export class PostList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedAuthor: "all"
        }

        // posts can be retrieve by either author/{AUTHOR_ID}/posts or posts
        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: Utils.getAuthor().id});
        this.props.dispatch({type: 'posts.reloadList'});
        if (this.props.foreign) {
            this.props.dispatch({
                type: 'postsGetForeignPosts',
                method: this.props.method,
                page: this.props.page || ""
            });
        } else {
            this.props.dispatch({
                type: 'postsGetPosts',
                method: this.props.method,
                authorId: this.props.authorId,
                page: this.props.page || "",
                size: 99999
            });
        }

        this.onChange = this.onChange.bind(this);
        this.getUniqueAuthors = this.getUniqueAuthors.bind(this);
        this.isFriendWith = this.isFriendWith.bind(this);
    }

    getUniqueAuthors(posts)
    {
        const authors = posts.map(function(post) {
            if (post.author) {
                return JSON.stringify(post.author);
            }
        });
        const uniqueAuthors = Array.from(new Set(authors)).map(function(author) {
            return JSON.parse(author);
        });;
        return uniqueAuthors;
    }

    onChange(event)
    {
        console.log(event.target.value);
        this.setState({
            selectedAuthor: event.target.value
        });
    }

    render()
    {
        let posts,
            resolved;
        if (this.props.foreign) {
            posts = this.props.foreignPosts;
            resolved = this.props.foreignResolved;
        } else {
            posts = this.props.posts;
            resolved = this.props.resolved;
        }

        // render
        if (!resolved || !this.props.authorResolved) {
            return (<ProgressBar active now={100}/>);
        } else if (posts.length && this.props.authorResolved) {
            const authors = this.getUniqueAuthors(posts), isForeign = this.props.foreign, selectedAuthor = this.state.selectedAuthor;
            return (
                <div>
                    <div className={(this.props.sending
                        ? "visible"
                        : "invisible") + " hide-yall-kids-hide-yall-wife"}>
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                    <ListGroup className="post-group">
                        <FormGroup className={this.props.canEdit ? "invisible" : "select-group"} controlId="formControlsSelect">
                            <ControlLabel>View Posts From</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" value={this.state.selectedAuthor} onChange={this.onChange}>
                                <option value="all">all authors</option>
                                <option value="friends">friends only</option>
                                {
                                    authors.map(function(author) {
                                        var  displayName = isForeign ? Utils.extractUsername(author.displayName) : author.displayName;
                                        return <option key={author.id} value={JSON.stringify(author)}> {displayName} from {author.host}</option>;
                                    })
                                }
                          </FormControl>
                        </FormGroup>
                        {posts.map((post, index) => {
                            let show = false;
                            if (selectedAuthor === JSON.stringify(post.author) || selectedAuthor === "all") {
                                show = true;
                            } else if (selectedAuthor === "friends" && this.isFriendWith(post.author)) {
                                show = true;
                            }
                            if (index >= 0 && index < posts.length && show) {
                                return (<PostListElement key={post.id} id={post.id} preview={true} foreign={isForeign} canEdit={this.props.canEdit}/>);
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

    isFriendWith(authorObj) {
        const friends = Utils.getAuthor().friends;
        return friends.some((friend) => {
            return friend.id === authorObj.id;
        });
    }

    componentDidUpdate()
    {
        if (!this.props.sending && this.props.commentSuccess) {
            this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: Utils.getAuthor().id});
            this.props.dispatch({type: 'posts.reloadList'});
            this.props.dispatch({
                type: 'postsGetForeignPosts',
                method: this.props.method,
                page: this.props.page || ""
            });
            this.props.dispatch({
                type: 'postsGetPosts',
                method: this.props.method,
                authorId: this.props.authorId,
                page: this.props.page || "",
                size: 99999
            });
            this.props.dispatch({type: 'comments.clearState'});
        }
    }

}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        posts: state.posts.list || [],
        foreignPosts: state.posts.foreignList || [],
        resolved: state.posts.resolved || false,
        foreignResolved: state.posts.foreignResolved || false,
        count: state.posts.count,
        foreignCount: state.posts.foreignCount,
        sending: state.comments.sending,
        commentSuccess: state.comments.success,
        method: own_props.method,
        authorId: own_props.authorId,
        foreign: own_props.foreign,
        authorResolved: state.users.authorResolved
    };
}
export default connect(mapStateToProps)(PostList);
