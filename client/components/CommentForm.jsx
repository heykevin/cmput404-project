import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor'
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
        this.state = {content:'', contentType: "text/markdown", edited: false};
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        console.log("Submitting comment");
        event.preventDefault();

        this.props.dispatch({
            type: "commentsAddComment",
            content: this.state.content,
            postId: this.props.postId,
            contentType: "text/markdown"
        });
        this.setState({content: ''});
    }

    onChange(content) {
        this.setState({
            content: this.state.contentType === "text/markdown" ? content : content.target.value,
            edited: true
        });
    }

    render()
    {
        return (
            <div className = "comment-form">
                <h4>Write Some Comments</h4>
                <Form onSubmit={this.onSubmit}>
                    <MarkdownEditor id="content-markdown"
                        initialContent={this.state.content}
                        iconsSet="font-awesome"
                        onContentChange={this.onChange}/>
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
