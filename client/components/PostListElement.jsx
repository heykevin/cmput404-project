import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PostDelete from './PostDelete.jsx';
import Utils from '../utils/utils.js';

export class PostListElement extends React.Component
{
    constructor(props)
    {
        super(props);
        this.modalDeleteShow = this.modalDeleteShow.bind(this);
        this.redirectToEditor = this.redirectToEditor.bind(this);
        this.finder = this.finder.bind(this);
        this.isFriendWith = this.isFriendWith.bind(this);
        this.sentFriendRequestTo = this.sentFriendRequestTo.bind(this);
        this.receivedFriendRequestFrom = this.receivedFriendRequestFrom.bind(this);
        this.sendFriendRequest = this.sendFriendRequest.bind(this);
    }

    render()
    {
        // get the post element data
        let post, href, time, content, friendStatus, buttonText, disabled;
        const sendFriendRequestText = "Send a friend request to",
        posts = this.props.foreign ? this.props.foreignPosts : this.props.posts;
        console.log(this.props.foreignPosts);
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
        const displayName = this.props.foreign && post.author.displayName.length > 2 ? post.author.displayName.substr(2) : post.author.displayName;
        time = new Date(post.published).toLocaleString();
        href = this.props.foreign ? post.origin : this.props.preview ? '/posts/' + post.id : "#";
        content = post.contentType.toLowerCase() === "text/markdown" ?  <ReactMarkdown source={post.content} /> : post.content;

        buttonText = (this.isFriendWith(post.author) ? "Alreayd friends with" : this.sentFriendRequestTo(post.author) ? "Friend request sent to" : this.receivedFriendRequestFrom(post.author) ? "Friend request received from" : sendFriendRequestText);
        disabled = buttonText !== sendFriendRequestText;
        buttonText += " " + displayName;
        friendStatus = <Button bsStyle="default" data-host={post.author.host} data-id={post.author.id} data-display-name={displayName} onClick={this.sendFriendRequest} disabled={disabled}>{buttonText}</Button>;
        const popoverHoverFocus =
                <Popover title="Profile" id={post.author.id}>
                    <strong>Display Name</strong>: {displayName} <br/>
                    <strong>Host</strong>: {post.author.host} <br/>
                    <strong>Bio</strong>: {post.author.bio || ""} <br/>
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
                    <a href={href} className="post-body">
                        <div className="post-title">
                            <span className="post-title-font">{post.title}</span>
                        </div>
                    </a>
                    <div className="post-info">
                        <span>Posted as {post.visibility} by <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}><strong>{displayName}</strong></OverlayTrigger> on {time}</span><br/>
                        <span className={post.author.id === Utils.getAuthor().id || !this.props.preview? "invisible" : "visible"}>{friendStatus}</span>
                    </div>
                    <a href={href}>
                        <div className="post-description">
                            {post.description}
                        </div>
                    </a>
                    <div className={this.props.preview ? "invisible" : "visible post-content"}>
                        {content}
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

    // Needs refactoring
    isFriendWith(user) {
        const author = Utils.getAuthor();
        return this.finder(author.friends, user.id);
    }

    sentFriendRequestTo(user) {
        const author = Utils.getAuthor();
        return this.finder(author.request_sent, user.id);
    }

    receivedFriendRequestFrom(user) {
        const author = Utils.getAuthor();
        return this.finder(author.request_received, user.id);
    }

    finder(sourceList, targetId) {
        if (sourceList) {
            for (const source of sourceList) {
                if (source.id === targetId) {
                    return true;
                }
            }
        }
        return false;
    }

    sendFriendRequest(event) {
        const author = Utils.getAuthor();
        const target = {
                id: event.target.dataset.id,
                displayName: event.target.dataset.displayName,
                host: event.target.dataset.host
            },
            actor = {
                id: author.id,
                displayName: author.displayName,
                host: author.host
            };

        if (!target.id) {
            return;
        }

        this.props.dispatch({type: 'users.sendingRequest', targetId: target.id});

        this.props.dispatch({type: 'usersBefriendAuthor', actor, target});

        this.props.dispatch({type: 'usersFetchAuthorProfile', authorId: author.id});
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
