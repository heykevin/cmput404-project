import React from 'react';
import {connect} from 'react-redux';
import { Modal, Button, FormGroup, FormControl, InputGroup, Col, PageHeader, Form } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form'

export class Signup extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            attempt: false,
            status: false
        }
        this.formSubmit = this.formSubmit.bind(this);
    }

    render() {
        console.log("redner", this.state);
        return (
            <div className="auth-form">
                <PageHeader> σ ﾟ∀ ﾟ) ﾟ∀ﾟ)σ Sign Up </PageHeader>
                {!this.state.status && this.state.attempt ? "Username/Password Invalid" : null}
                <Form horizontal onSubmit={this.props.handleSubmit(this.formSubmit)}>
                    <Field name="username" component={AuthorsignupName} />
                    <Field name="password" component={AuthorsignupPass} />
                    <FormGroup>
                        <Button type="submit"> Sign Me Up! </Button>
                    </FormGroup>
                </Form>
            </div>
        );

    }

    formSubmit(form) {
        console.log(form);
        this.props.dispatch({
            type: "authSignup",
            username: form.username,
            password: form.password
        });
    }
}

class AuthorsignupName extends React.Component {
    render() {
        return (
            <FormGroup>
                <Col sm={2}>Username</Col>
                <InputGroup>
                    <FormControl {...this.props.input} id="username" type="text" />
                </InputGroup>
            </FormGroup>
        );
    }
}

class AuthorsignupPass extends React.Component {
    render() {
        return (
            <FormGroup>
                <Col sm={2}>Password</Col>
                    <InputGroup>
                        <FormControl {...this.props.input} id="password" type="password" placeholder="password"/>
                    </InputGroup>
            </FormGroup>
        )
    }
}

const validate = (values) => {
    const errors = {};
    console.log("validate");
    console.log(values);
    return errors;
}

const signupForm = reduxForm({
    form: 'signup',
    validate: validate
})(Signup);

// export the connected class
function mapStateToProps(state) {
    return {
        status: state.signup,
        attempt: state.attempt,
        error: state.error
    }
}

export default connect(mapStateToProps)(signupForm);
