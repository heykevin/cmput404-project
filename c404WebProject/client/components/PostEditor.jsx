import React, {Component} from 'react';
import {connect} from 'react-redux';
import {MarkdownEditor, MarkdownEditorContentStore} from 'react-markdown-editor';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

export class PostEditor extends React.Component {

    constructor(props)
    {
        super(props);
        console.dir(props);
        this.state = {
            content: "",
            title: "",
            description: "",
            disableButton: true
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
    }

    render()
    {
        return (
            <div className="post-editor">
                <Form horizontal onSubmit={this.onSubmit}>
                    <FormGroup>
                        <ControlLabel>Title</ControlLabel>
                        <FormControl id="title" type="text" label="Title" placeholder="Title" required={true} onChange={this.onTitleChange}/>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl id="description" type="text" label="Description" placeholder="Description" required={true} onChange={this.onDescriptionChange}/>
                    </FormGroup>
                    <FormGroup>
                        <MarkdownEditor id="content" initialContent="" iconsSet="font-awesome" onContentChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Button className="post-editor-save" type="submit" disabled={this.state.disableButton}>
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
            // author:
            // categories:
            // dateTime:
            // visibility:
        };
        this.props.dispatch({type: "postsSavePost", postData: data});
    }

    onChange(content)
    {
        this.setState({
            content: content,
            disableButton: !this.getButtonAvailability()
        });
    }

    onTitleChange(event)
    {
        this.setState({
            title: event.target.value,
            disableButton: !this.getButtonAvailability()
        });
    }

    onDescriptionChange(event)
    {
        this.setState({
            description: event.target.value,
            disableButton: !this.getButtonAvailability()
        });
    }

    getButtonAvailability() {
        return this.state.title.length > 0 && this.state.description.length > 0 && this.state.content.length > 0;
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(PostEditor);
