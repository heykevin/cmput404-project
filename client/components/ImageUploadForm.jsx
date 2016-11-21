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
import { Field, reduxForm } from 'redux-form'

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
                        <Field name="file" component="input" type="file" />
                        <HelpBlock>Only gifs, jpgs, jpegs, and pngs are accepted.</HelpBlock>
                        <Button bsStyle="primary" type="submit">
                            Upload
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );

    }

    uploadImage(form) {
        console.log(form.target[0].files[0]);
        this.props.dispatch({type: "imagesUpload", photo: form.target[0].files[0]});
    }
}
const uploadForm = reduxForm({
    form: 'uploadFile'
})(ImageUploadForm);

function mapStateToProps(state) {
    return {status: state.images.status}
}

export default connect(mapStateToProps)(uploadForm);
