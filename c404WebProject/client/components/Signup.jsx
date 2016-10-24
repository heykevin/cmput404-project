import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, FormGroup, FormControl} from 'react-bootstrap';

import InfoForm from './InfoForm.jsx';

export class Signup extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            passwordValidation: this.props.passwordValidation | {},
            usernameValidation: this.props.usernameValidation | {},
            submitting: false
        }
        this.signupRequest = this.signupRequest.bind(this);
    }

    render()
    {
        return (
            <div className="auth-form">
                <InfoForm
                    onSubmit={this.signupRequest}
                    passwordValidation={this.props.passwordValidation}
                    usernameValidation={this.props.usernameValidation}
                    buttonText="Sign Up"/>
            </div>
        );
    }

    signupRequest(username, password) {
        console.log("trying to sign up with username: " + username + "password: " + password);
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        submitting: state.submitting,
        passwordValidation: {
            status: state.passwordStatus,
            errMsg: state.passwordErrMsg
        },
        usernameValidation: {
            status: state.usernameStatus,
            errMsg: state.usernameErrMsg
        }
    };
}
export default connect(mapStateToProps)(Signup);
