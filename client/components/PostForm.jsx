import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor';
import {Form, FormGroup, FormControl, ControlLabel, Button, Nav, NavItem, ProgressBar} from 'react-bootstrap';
import Notifications, {notify} from 'react-notify-toast';

import Utils from '../utils/utils.js';
import {getApi} from '../config.js';

const host = getApi();
export class PostForm extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            title: "",
            description: "",
            content: "",
            visibility: "PUBLIC",
            disableButton: true,
            isMarkdownContent: true,
            edited: false,
            editorModeOverride: false,
            category: ""
        };

        this.getEditorMode = this.getEditorMode.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
    }

    render()
    {
        let givenPost;
        if (this.props.response || this.props.error) {
            givenPost = this.props.savePost;
        } else {
            givenPost = this.props.post || {};
        }

        if (this.props.redirect && !this.props.error) {
            notify.show("Your post has been saved! You'll be redirected to 'My posts' after 3 seconds.", "success");
            setTimeout(function() {
                Utils.redirect(`${host}myposts`);
            }, 3000);
        } else if (this.props.error) {
            notify.show("Sorry, we have problem saving your post! Please try again later.", "error");
        }

        return (
            <div className="post-editor">
                <Notifications/>
                <div className={this.props.redirect ? "hide-yall-kids-hide-yall-wife" : "invisible"}>
                </div>
                <Nav bsStyle="pills" onSelect={this.handleSelect}>
                    <NavItem className="nav-item float-right" eventKey={false}>
                        SimpleText
                    </NavItem>
                    <NavItem className="nav-item float-right" eventKey={true}>
                        MarkDown
                    </NavItem>
                </Nav>
                <Form horizontal onSubmit={this.onSubmit}>
                    <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl id="title"
                            type="text"
                            label="Title*"
                            placeholder="Title"
                            defaultValue={this.props.post.title}
                            required={true}
                            onChange={this.onTitleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <FormControl id="category"
                            type="text"
                            label="Category*"
                            placeholder="Category"
                            defaultValue={this.props.post.category}
                            required={true}
                            onChange={this.onCategoryChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl id="description"
                            type="text"
                            label="Description*"
                            placeholder="Description"
                            defaultValue={this.props.post.description}
                            required={true}
                            onChange={this.onDescriptionChange}/>
                    </FormGroup>
                    <FormGroup className={this.getEditorMode() ? "invisible" : "visible"}>
                        <textarea className="content-simple-text"
                            defaultValue={this.props.post.content}
                            onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup className={this.getEditorMode() ? "visible" : "invisible"}>
                        <MarkdownEditor id="content-markdown"
                            initialContent={this.props.post.content}
                            iconsSet="font-awesome"
                            onContentChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup className="post-visibility">
                        <ControlLabel>This post will be made visible to
                        </ControlLabel>
                        <FormControl id="visibility" componentClass="select"
                            placeholder="visibility"
                            onChange={this.onVisibilityChange}>
                            <option value="PUBLIC">Public</option>
                            <option value="FOAF">Friends of a friend</option>
                            <option value="FRIENDS">Friends only</option>
                            <option value="PRIVATE">only me</option>
                            <option value="SERVERONLY">users on my server</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Button className="post-editor-save"
                            type="submit"
                            disabled={this.state.disableButton}>
                            Save
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );

    }

    onSubmit(event)
    {

        let data = {
            title: this.state.title,
            description: this.state.description,
            content: this.state.content,
            visibility: this.state.visibility,
            contentType: this.state.isMarkdownEditor ? "text/markdown" : "text/plain",
            category: this.state.category
        };
        event.preventDefault();
        this.props.dispatch({type: "postsSavePost", postData: data});
    }

    handleSelect(isMarkdownContent)
    {
        this.setState({
            editorModeOverride: true,
            isMarkdownContent: isMarkdownContent
        })
    }

    onVisibilityChange(event)
    {
        this.setState({
            visibility: event.target.value
        });
    }

    onChange(content)
    {
        this.setState({
            content: content,
            edited: true,
            disableButton: this.isButtonDisabled()
        });
    }

    onTitleChange(event)
    {
        this.setState({
            title: event.target.value,
            edited: true,
            disableButton: this.isButtonDisabled()
        });
    }

    onCategoryChange(event)
    {
        this.setState({
            category: event.target.value,
            edited: true,
            disableButton: this.isButtonDisabled()
        });
    }

    onDescriptionChange(event)
    {
        this.setState({
            description: event.target.value,
            edited: true,
            disableButton: this.isButtonDisabled()
        });
    }

    getEditorMode() {
        return this.state.editorModeOverride ? this.state.isMarkdownContent : this.props.post.isMarkdownContent;
    }

    isButtonDisabled() {
        if (this.props.isEditMode && !this.state.edited) {
            return false;
        } else {
            return !(this.state.title.length > 0 && this.state.description.length > 0 && this.state.content.length > 0 && this.state.category.length > 0);
        }
    }
}

// export the connected class
function mapStateToProps(state, props) {

    return {
        response: state.posts.response,
        redirect: state.posts.redirect,
        error: state.posts.error,
        savedPost: state.posts.postData
    }
}

export default connect(mapStateToProps)(PostForm);
