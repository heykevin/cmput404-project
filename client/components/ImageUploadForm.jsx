import React from 'react';
import {connect} from 'react-redux';
import {
    Button,
    Form,
    FormControl,
    ControlLabel,
    FormGroup,
    Col,
    HelpBlock
} from 'react-bootstrap';

export class ImageUploadForm extends React.Component {
    constructor(props)
    {
        super(props);   
        this.uploadImage = this.uploadImage.bind(this);
    }

    render() {
        return (
            <div className="image-form">
                <Form horizontal onSubmit={this.uploadImage}>
                    <FormGroup controlId='formControlsFile'>
                        <ControlLabel>File</ControlLabel>
                        <FormControl type="file" label="File" accept=".gif, .jpg, .png, .jpeg" />
                        <HelpBlock>Only gifs, jpgs, jpegs, and pngs are accepted.</HelpBlock>
                    </FormGroup>
                    <Button bsStyle="primary" type="submit">
                        Upload
                    </Button>
                </Form>
            </div>
        );

    }

    uploadImage(form) {
        console.log(form    );
        //this.props.dispatch({type: "imageUpload", photo: form.file});
    }
}

function mapStateToProps(state) {
    return {
        status: state.images.status
    }
}

export default connect(mapStateToProps)(ImageUploadForm);
