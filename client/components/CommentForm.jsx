import React from 'react';
import Router from 'react-router';
import {connect} from 'react-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor'
import {Link} from 'react-router';
import {push} from 'react-router-redux';
import {Button, Glyphicon, ListGroupItem, ListGroup, Popover, OverlayTrigger, Form, FormControl, ControlLabel, FormGroup, Nav, NavItem,} from 'react-bootstrap';
import Utils from '../utils/utils.js';
import {notify} from 'react-notify-toast';

//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

export class CommentForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            content:'',
            contentType: "text/markdown",
            edited: false,
            editorModeOverride: false,
            disableButton: true
        };
        this.getEditorMode = this.getEditorMode.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(event) {
        console.log("Submitting comment");
        event.preventDefault();
        console.log("Form content type --> " + this.props.contentType);
        this.props.dispatch({
            type: "commentsAddComment",
            content: this.state.content,
            postId: this.props.postId,
            contentType: this.state.contentType
        });
        this.setState({content: ''});
    }

    onChange(content) {
        this.setState({
            content: this.state.contentType === "text/markdown" ? content : content.target.value,
            edited: true,
            disableButton: this.isButtonDisabled()
        });
    }

    getEditorMode() {
        return this.state.editorModeOverride ? this.state.contentType === "text/markdown" : (this.state.contentType && this.state.contentType ? this.state.contentType ==="text/markdown" : true);
    }

    handleSelect(isMarkdownContent)
    {
        this.setState({
            editorModeOverride: true,
            contentType: isMarkdownContent ? "text/markdown" : "text/plain",
            edited: true
        });
    }

    isButtonDisabled() {
        return !(this.state.content.length > 0);
    }

    render()
    {
        return (
            <div className = "comment-form">
                <h4>Write Some Comments</h4>
                    <Nav bsStyle="pills" onSelect={this.handleSelect}>
                        <NavItem className="nav-item float-right" eventKey={false}>
                            SimpleText
                        </NavItem>
                        <NavItem className="nav-item float-right" eventKey={true}>
                            MarkDown
                        </NavItem>
                    </Nav>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup className={this.getEditorMode() ? "invisible" : "visible"}>
                        <textarea className="content-simple-text"
                            defaultValue={this.state.content}
                            onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup className={this.getEditorMode() ? "visible" : "invisible"}>
                        <MarkdownEditor id="content-markdown"
                            initialContent={this.state.content}
                            iconsSet="font-awesome"
                            onContentChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Button className="comment-form-save" type="submit" disabled={this.state.disableButton}>
                            Comment
                        </Button>
                    </FormGroup>
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
