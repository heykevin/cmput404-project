import React from 'react';
import {connect} from 'react-redux';
import { Modal, Button, FormGroup, FormControl, InputGroup, Col, PageHeader, Form } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form'

export class Login extends React.Component {
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
                <PageHeader> Login </PageHeader>
                {!this.state.status && this.state.attempt ? "Username/Password Invalid" : null}
                <Form horizontal onSubmit={this.props.handleSubmit(this.formSubmit)}>
                    <Field name="username" component={AuthorLoginName} />
                    <Field name="password" component={AuthorLoginPass} />
                    <FormGroup>
                        <Button type="submit"> Login </Button>
                    </FormGroup>
                </Form>
            </div>
        );

    }

    formSubmit(form) {
        console.log(form);
        this.props.dispatch({
            type: "authLogin",
            username: form.username,
            password: form.password
        });
    }
}

class AuthorLoginName extends React.Component {
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

class AuthorLoginPass extends React.Component {
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

const LoginForm = reduxForm({
    form: 'login',
    validate: validate
})(Login);

// export the connected class
function mapStateToProps(state) {
    return {
        status: state.login,
        attempt: state.attempt,
        error: state.error
    }
}

export default connect(mapStateToProps)(LoginForm);
