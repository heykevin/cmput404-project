import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PostDelete from './PostDelete.jsx';
import Utils from '../utils/utils.js';
import Comment from './Comment.jsx';


//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

export class CommentBox extends React.createClass{

    constructor(props)
    {
        super(props);
        this.state = {comments:[]}
    }

    loadCommentsFromServer()
    {
      this.props.dispatch({
          type: "commentsGetComment",
          postId: this.props.postId
      });
    }

    componentDidMount()
    {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, 1000);
    }

    render()
    {

        loadCommentsFromServer();
        let comments = this.props.comments;
        if (comments.length) {
            return (
                <ListGroup className="comment-group">
                    <h1>Comments</h1>
                    {comments.map((comment,index) => {
                        if (index >= 0 && index < comments.length) {
                            return (<Comment content={comment.content} author={comment.author}/>)
                        }
                    })}
                </ListGroup>
            );
        } else {
            return (<div>
                <h1>Comments</h1>
                <h1>No comments yet</h1>
            </div>);
        }
    }
}


// export the connected class
function mapStateToProps(state, props) {
    // pass the state defaultValues
    return {
        comment: state.comment,
    }
}

export default connect(mapStateToProps)(CommentBox);
