import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import Utils from '../utils/utils.js';

//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

export class CommentForm extends React.Component
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
        e.preventDefault();

        this.props.dispatch({
            type: "commentsAddComment",
            content: this.state.content,
            postId: this.props.postId
        });
    this.setState({content: '', postId: ''});
    }

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
                    placeholder = "Write comment"
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
