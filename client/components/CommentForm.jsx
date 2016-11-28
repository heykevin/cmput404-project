import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import {Button, Glyphicon, ListGroupItem, ListGroup, Popover, OverlayTrigger, Form, FormControl} from 'react-bootstrap';
import Utils from '../utils/utils.js';

//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

export class CommentForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {content:'', comments:[]};
        this.onSubmit = this.onSubmit.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    onSubmit(event) {
        console.log("Submitting comment");
        event.preventDefault();

        this.props.dispatch({
            type: "commentsAddComment",
            content: this.state.content,
            postId: this.props.postId
        });
        this.setState({content: ''});
    }

    handleContentChange(event) {
        let content = event.target.value;
        this.setState({content: content});
    }

    render()
    {
        return (
            <div className = "comment-form">
                <h4>Write Some Comments</h4>
                <Form onSubmit={this.onSubmit}>
                    <FormControl
                        placeholder = "Write comment"
                        onChange = {this.handleContentChange}
                        type="text"
                        value={this.state.content}
                        />
                    <Button type = "submit">
                        Comment
                    </Button>
                </Form>
            </div>
        );
    }
}

// export the connected class
function mapStateToProps(state, own_props) {

    return {
        postId: own_props.postId,
    }
}
export default connect(mapStateToProps)(CommentForm);
