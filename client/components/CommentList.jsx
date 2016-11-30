import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {Glyphicon, ListGroupItem, ListGroup} from 'react-bootstrap';
import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

export class CommentList extends React.Component
{

    constructor(props)
    {
        super(props);
    }

    render()
    {
        const posts = this.props.foreign ? this.props.foreignPosts : this.props.posts;
        let comments;
        for (const post of posts) {
            if (post.id === this.props.postId) {
                comments = post.comments;
                break;
            }
        }

        if (comments && comments.length)
        {
            return(
                <div className = "comment-list">
                    <h4>Comments</h4>
                    <ListGroup className = "comment-group">
                        {comments.map((comment, index) => {
                            if (index >= 0 && index < comments.length) {
                                const content = comment.contentType && comment.contentType.toLowerCase().includes('markdown') ? <ReactMarkdown source={comment.comment} /> : comment.comment,
                                      displayName = [getApi(), "http://localhost:8000", "http://127.0.0.1:8000"].indexOf(comment.author.host) > -1 ? comment.author.displayName : Utils.extractUsername(comment.author.displayName);
                                return (
                                    <div key={comment.id} className='comment'>
                                        <div className='flex comment-author'>
                                            <div><Glyphicon glyph="comment"/><strong>{displayName}:</strong></div><div>{new Date(comment.published).toLocaleString()}</div>
                                        </div>
                                        <div className='flex comment-content'>
                                            {content}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </ListGroup>
                </div>
            );
        } else {
            return (<div key={this.props.postId} className='comment-list'><h4>No comments yet</h4></div>);
        }
    }
}

// export the connected class
function mapStateToProps(state, own_props) {

    return {
        postId: own_props.postId,
        posts: state.posts.list || [],
        foreignPosts: state.posts.foreignList || [],
        foreign: own_props.foreign
    };
}
export default connect(mapStateToProps)(CommentList);
