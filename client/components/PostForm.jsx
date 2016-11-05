import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor';
import {Form, FormGroup, FormControl, ControlLabel, Button, Nav, NavItem, ProgressBar} from 'react-bootstrap';
import {notify} from 'react-notify-toast';

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
            content_type: "text/markdown",
            edited: false,
            editorModeOverride: false,
            category: "",
            change: false
        };

        if (this.props.isEditMode && this.props.post) {
            this.state = this.props.post;
        } else if (this.props.isEditMode && !this.props.post) {
            Utils.redirect('/myposts');
        }

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
        let givenPost, isNewPost;
        console.log('this.props.response ' + this.props.response);
        if (this.props.response || this.props.error) {
            givenPost = this.props.savedPost;
        } else {
            givenPost = this.props.post || {};
        }

        if (this.props.redirect && !this.props.error) {
            notify.show("Post Saved! Redirecting you...", "success", 3000);
            const url = this.props.response && this.props.response.id ? '/posts/' + this.props.response.id : '/dashboard';
            setTimeout(() => {
                Utils.redirect(url);
                this.props.dispatch({type: "posts.clearEditorRelatedState"});
            }, 5000);
        } else if (this.props.error){
            notify.show("Failed to save! Please try again later. " + this.props.error, "error", 3000);
        }

        return (
            <div className="post-editor">
                <div className={this.props.redirect ? "hide-yall-kids-hide-yall-wife" : "invisible"}>
                    <i className="fa fa-spinner fa-spin"></i>
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
                            maxLength="50"
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
                            maxLength="20"
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
                            maxLength="50"
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
                            placeholder="visibility">
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
            visibility: document.getElementById("visibility").value, // this is faster -- hackin' my way lol
            contentType: this.state.content_type,
            category: this.state.category
        };
        event.preventDefault();
        console.log(data.visibility);
        if (this.props.isEditMode) {
            console.log("here", this.state.id);
            data.id = this.state.id;
            this.props.dispatch({type: "postsUpdatePost", postData: data});
        } else {
            this.props.dispatch({type: "postsSavePost", postData: data});
        }
    }

    handleSelect(isMarkdownContent)
    {
        this.setState({
            editorModeOverride: true,
            content_type: isMarkdownContent ? "text/markdown" : "text/plain",
            edited: true
        });
    }

    onVisibilityChange(event)
    {
        this.setState({
            visibility: event.target.value,
            edited: true
        });
    }

    onChange(content)
    {

        this.setState({
            content: this.state.content_type === "text/markdown" ? content : content.target.value,
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
        return this.state.editorModeOverride ? this.state.content_type === "text/markdown" : (this.props.post.content_type && this.props.post.content_type ? this.props.post.content_type ==="text/markdown" : true);
    }

    isButtonDisabled() {
        console.log("isEditmode " + this.props.isEditmode);
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
        savedPost: state.posts.postData,
        post: props.post
    }
}

export default connect(mapStateToProps)(PostForm);
