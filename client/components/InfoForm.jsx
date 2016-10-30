import React from 'react';
import {connect} from 'react-redux';
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock,
    Col,
    Button
} from 'react-bootstrap';

export default class InfoForm extends React.Component
{
    constructor(props)
    {
        super(props);
        console.dir(props);
        this.state = {
            username: "",
            password: "",
            canSubmit: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    render() {
        return (
            <Form horizontal onSubmit={this.onSubmit}>
                <FormGroup validationState={this.props.usernameValidation && this.props.usernameValidation.status
                    ? this.props.usernameValidation.status
                    : null}>
                    <Col componentClass={ControlLabel} sm={3}>
                        Username
                    </Col>
                    <Col sm={8}>
                        <FormControl required={true} type="text" maxLength="20" value={this.state.username} placeholder="username" onChange={this.handleUsernameChange}/>
                        <FormControl.Feedback/>
                        <HelpBlock>Only alpha-numeric characters are accepted</HelpBlock>
                    </Col>
                </FormGroup>
                <FormGroup validationState={this.props.passwordValidation && this.props.passwordValidation.status
                    ? this.props.passwordValidation.status
                    : null}>
                    <Col componentClass={ControlLabel} sm={3}>
                        Password
                    </Col>
                    <Col sm={8}>
                        <FormControl required={true} type="password" maxLength="40" value={this.state.password} placeholder="••••••" onChange={this.handlePasswordChange}/>
                        <FormControl.Feedback/>
                    </Col>
                </FormGroup>
                <FormGroup>
                    <Col smOffset={5}>
                        <Button type="submit" disabled={!this.state.canSubmit || this.props.invalid || this.props.submitting}>
                            {this.props.buttonText || "Submit"}
                        </Button>
                    </Col>
                </FormGroup>
            </Form>
        );
    }

    onSubmit(event) {
        console.log("infoform onsubmit", this.state.username, this.state.password);
        this.props.onSubmit(this.state.username, this.state.password);
    }

    _canSubmit() {
        return this.state.username && this.state.password;
    }

    handleUsernameChange(event) {
        const username = event.target.value;
        console.log("username change: " + event.target.value);
        this.setState({"username": username});
        this.setState({"canSubmit": this._canSubmit()});
    }

    handlePasswordChange(event) {
        console.log("password change: " + event.target.value);
        this.setState({"password": event.target.value});
        this.setState({"canSubmit": this._canSubmit()});
    }

}
