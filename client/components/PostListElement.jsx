import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import PostDelete from './PostDelete.jsx';
import Utils from '../utils/utils.js';
import CommentForm from './CommentForm.jsx';
import CommentList from './CommentList.jsx';

import {getApi} from '../config.js';

export class PostListElement extends React.Component
{
    constructor(props)
    {
        super(props);
        this.modalDeleteShow = this.modalDeleteShow.bind(this);
        this.redirectToEditor = this.redirectToEditor.bind(this);
    }

    render()
    {
        // get the post element data
        let post, href, time, content, friendStatus, buttonText, disabled, origin;
        const sendFriendRequestText = "Send a friend request to",
        posts = this.props.foreign ? this.props.foreignPosts : this.props.posts;
        if (this.props.view === "view" && ! (this.props.posts instanceof Array)) {
            post = this.props.posts;
        } else if (posts.length > 0){
            for (const val of posts) {
                if (val.id === this.props.id) {
                    post = val;
                    break;
                }
            }
        }

        if (!post) {
            return null;
        }
        const displayName = this.props.foreign ? Utils.extractUsername(post.author.displayName) : post.author.displayName;
        time = new Date(post.published).toLocaleString();
        href = this.props.foreign ? post.origin : this.props.preview ? '/posts/' + post.id : "#";
        href = "#";
        origin = [getApi(), "http://localhost:8000", "http://127.0.0.1:8000"].indexOf(post.author.host) > -1 ? "Bloggy Blog" : post.author.host;
        content = post.contentType.toLowerCase() === "text/markdown" || post.contentType.toLowerCase() === "text/x-markdown" ?  <ReactMarkdown source={post.content} /> : post.content;

        const popoverHoverFocus =
                <Popover title="Profile" id={post.author.id}>
                    <strong>Display Name</strong>: {displayName} <br/>
                    <div className="pop-over"><strong>Host</strong>: {post.author.host}</div>
                    <div className="pop-over"><strong>Bio</strong>: {post.author.bio || ""}</div>
                </Popover>;

        return (
                <ListGroupItem data-id={post.id}>
                    <div className={this.props.canEdit ? "visible float-right buttons" : "invisible"}>
                        <Button bsSize="xsmall" data-id={post.id}
                            onClick={this.redirectToEditor}>
                            Edit <Glyphicon data-id={post.id} glyph="edit"/>
                        </Button>
                        <Button bsSize="xsmall"  data-id={post.id} data-title={post.title}
                            onClick={this.modalDeleteShow}>
                            Delete <Glyphicon data-id={post.id} data-title={post.title} glyph="remove-circle"/>
                        </Button>
                    </div>
                    <div className="post-body">
                        <div className="post-title">
                            {post.title}
                        </div>
                        <div className="post-info">
                            Posted on {origin} as {post.visibility} by <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}><strong>{displayName}</strong></OverlayTrigger><br/>on {time}
                        </div>
                        <div className="post-content">
                            {content}
                        </div>
                        <CommentList postId={post.id} foreign={this.props.foreign}/>
                        <CommentForm postId={post.id} foreign={this.props.foreign}/>
                    </div>
                    <PostDelete/>
                </ListGroupItem>
        );
    }
    redirectToEditor(event)
    {
        this.props.dispatch({
            type: "postsEditPostRedirect",
            id: event.target.dataset.id
        });
    }

    modalDeleteShow(event)
    {
        this.props.dispatch({
            type: 'posts.modalDeleteShow',
            id: event.target.dataset.id,
            title: event.target.dataset.title
        });
    }

}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        posts: state.posts.list || [],
        foreignPosts: state.posts.foreignList || [],
        id: own_props.id,
        foreign: own_props.foreign
    }
}
export default connect(mapStateToProps)(PostListElement);
