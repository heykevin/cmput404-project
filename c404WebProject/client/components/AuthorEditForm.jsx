import React from 'react';
import {connect} from 'react-redux';
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';

export class AuthorEditForm extends React.Component {
    //currentState = getState();

    constructor(props)
    {
        super(props);
            this.state = {
                display_name: '',
                first_name: '',
                last_name: '',
                email: '',
                github_username: '',
                bio: ''
            }
        this.handleDisplayNameChange = this.handleDisplayNameChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.display_name, this.state.first_name, this.state.last_name, this.state.email, this.state.github_username, this.state.bio);
        console.log("dispatch action authEdit");

        //Method one Error --> method not defined
        this.props.dispatch({
            type: "authEdit",
            display_name: this.state.display_name,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            github_username: this.state.github_username,
            bio: this.state.bio
        });
    }

    handleDisplayNameChange(event) {
        let display_name = event.target.value;
        this.setState({display_name: display_name});
        console.log("Author setting", this.state);
    }

    handleFirstNameChange(event) {
        let first_name = event.target.value;
        this.setState({first_name: first_name});
        console.log("Author setting", this.state);
    }

    handleLastNameChange(event) {
        let last_name = event.target.value;
        this.setState({last_name: last_name});
        console.log("Author setting", this.state);
    }

    handleEmailChange(event) {
        let email = event.target.value;
        this.setState({email: email});
        console.log("Author setting", this.state);
    }

    handleGithubChange(event) {
        let github_username = event.target.value;
        this.setState({github_username: github_username});
        console.log("Author setting", this.state);

    }

    handleBioChange(event) {
        let bio = event.target.value;
        this.setState({bio: bio});
        console.log("Author setting", this.state);
    }

    render() {
        // Need to add SERVERONLY to
        console.log("Author setting", this.state);

        return (
            <div className="author-edit-form">
                <Form onSubmit={this.onSubmit.bind(this)}>
                    <ControlLabel> Display name </ControlLabel>
                    <FormControl
                        onChange = {this.handleDisplayChange}
                        id="display_nameEdit"
                        type="text"
                        value={this.state.display_name}
                        />
                    <ControlLabel> First name </ControlLabel>
                    <FormControl
                        onChange = {this.handleFirstNameChange}
                        id="first_nameEdit"
                        type="text"
                        value={this.state.first_name}
                        />
                    <ControlLabel> Last name </ControlLabel>
                    <FormControl
                        onChange = {this.handleLastNameChange}
                        id="last_nameEdit"
                        type="text"
                        value={this.state.last_name}
                        />
                    <ControlLabel> Email </ControlLabel>
                    <FormControl
                        onChange = {this.handleEmailChange}
                        id="emailEdit"
                        type="email"
                        value={this.state.email}
                        />
                    <ControlLabel> Github account </ControlLabel>
                    <FormControl
                        onChange = {this.handleGithubChange}
                        id="github_usernameEdit"
                        type="text"
                        value={this.state.github_username}
                        />
                    <ControlLabel> Bios </ControlLabel>
                    <FormControl
                        onChange = {this.handleBiosChange}
                        id="bioEdit"
                        type="text"
                        value={this.state.bio}
                        />
                    <Button type = "submit">
                        Submit
                    </Button>
                </Form>

            </div>
        );
    }
}

//connects

// export the connected class
function mapStateToProps(state, props) {

    // set the form data
    let form_data = {
        display_name: state.display_name,
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        github_username: state.github_username,
        bio: state.bio
    };


    // pass the state values
    return {
        form_data,
    };
}
export default connect(mapStateToProps)(AuthorEditForm);
