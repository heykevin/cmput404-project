import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, FormGroup, FormControl} from 'react-bootstrap';

import InfoForm from './InfoForm.jsx';

export class Login extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            passwordValidation: this.props.passwordValidation | {},
        }
        this.loginRequest = this.loginRequest.bind(this);
    }

    render()
    {
        return (
            <div className="auth-form">
                <InfoForm
                    onSubmit={this.loginRequest}
                    passwordValidation={this.props.passwordValidation}
                    buttonText="Log In"/>
            </div>
        );
    }

    loginRequest(username, password) {
        console.log("trying to log in with username: " + username + "password: " + password);
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
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
export default connect(mapStateToProps)(Login);
