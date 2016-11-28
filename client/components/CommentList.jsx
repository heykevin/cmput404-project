import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor';
import {Button, Nav, NavItem, ProgressBar, Glyphicon, ListGroupItem, ListGroup, Popover, OverlayTrigger, Form, FormGroup, FormControl} from 'react-bootstrap';
import Utils from '../utils/utils.js';
import Comment from './Comment.jsx';

export class CommentList extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {comments:[]};
    }

    componentWillMount() {
        this.props.dispatch({type: 'commentsGetComment', postId: this.props.postId});
    }

    // contentformat(utext){
    //     var x = utext;
    //     var r = /\\u([\d\w]{4})/gi;
    //     x = x.replace(r, function (match, grp) {
    //         return String.fromCharCode(parseInt(grp, 16)); } );
    //     x = unescape(x);
    //     console.log(x);
    // }

    render()
    {
        let comments = this.props.comments;
        console.log("What are you getting --> " + this.props.postId + " --> " + this.props.comments);
        console.log("Comment Length --> " + this.props.postId + " --> " + comments.length);
        if (comments.length)
        {
            return(
                <div className = "comment-list">
                    <h4>Comment list</h4>
                    <ListGroup className = "comment-group">
                        {comments.map((comment, index) => {
                            if (index >= 0 && index < comments.length) {
                                return (<Comment key={index} id={comments[index].id} author={comments[index].author.displayName} content={comments[index].content} postId={comments[index].post} published={comments[index].published}/>);
                            }
                        })}
                    </ListGroup>
                </div>
            );
        } else {
            return(
                <div className = "comment-list">
                    <h4>Waiting for comments</h4>
                </div>
            );
        }
    }
}

// export the connected class
function mapStateToProps(state, own_props) {

    return {
        postId: own_props.postId,
        comments: state.comments.list[own_props.postId] || [],
    };
}
export default connect(mapStateToProps)(CommentList);
