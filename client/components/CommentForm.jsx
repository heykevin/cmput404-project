import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import Utils from '../utils/utils.js';


class CommentForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {content:''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    onSubmit(event) {
        console.log("Submitting comment");
    //     // e.preventDefault();
    //     // var postId = this.props.postId;
    //     // var author = Utils.getAuthor().displayName;
    //     // var authorId = Utils.getAuthor().id;
    //     // var text = this.state.text.trim();
    //     //
    //     // console.log("Can you get PostID --> " + this.props.postId);
    //     //
    //     // if (!text) {
    //     //     return;
    //     // }
    //     //
    //     // handleCommentSubmit({author: author, text: text, authorId: authorId, postId: postId});
    //     // this.setState({author: '', text: '', postId: '', authorId: '', postId:''});
    }
    //
    handleContentChange(event) {
        let content = event.target.value;
        this.setState({content: content});
    }

    render()
    {
        return (
            <div className = "comment-form">
              <Form onSubmit={this.onSubmit.bind(this)}>
                <FormControl
                    onChange={this.handleContentChange}
                    place
                    type="text"
                    value={this.state.content}
                    />
                <Button type = "submit">
                    submit
                </Button>
            </Form>
          </div>
        );
    }

}

export default CommentForm;
