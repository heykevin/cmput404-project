import React from 'react';
import {connect} from 'react-redux';
import Utils from '../utils/utils.js';
import Profile from '../pages/Profile.jsx'
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';

const author = Utils.getAuthor();
console.log(author);

export class AuthorEditForm extends React.Component {
    //currentState = getState();

    constructor(props)
    {
        super(props);
            this.state = {
                first_name: author.first_name,
                last_name: author.last_name,
                email: author.email,
                github_username: author.github_username,
                bio: author.bio
            }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.first_name, this.state.last_name, this.state.email, this.state.github_username, this.state.bio);
        console.log("dispatch action authEdit");

        this.props.dispatch({
            type: "authEdit",
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            github_username: this.state.github_username,
            bio: this.state.bio
        });
        Utils.redirect("/profile");
    }

    handleFirstNameChange(event) {
        let first_name = event.target.value;
        this.setState({first_name: first_name});
    }

    handleLastNameChange(event) {
        let last_name = event.target.value;
        this.setState({last_name: last_name});
    }

    handleEmailChange(event) {
        let email = event.target.value;
        this.setState({email: email});
    }

    handleGithubChange(event) {
        let github_username = event.target.value;
        this.setState({github_username: github_username});
    }

    handleBioChange(event) {
        let bio = event.target.value;
        this.setState({bio: bio});
    }

    render() {
        return (
            <div className="author-edit-form">
                <Form onSubmit={this.onSubmit.bind(this)}>
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
                        onChange = {this.handleBioChange}
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

function backToProfile(){
    console.log("return to profile")
    window.location.assign("http://localhost:8080/profile")
}

// export the connected class
function mapStateToProps(state, props) {

    // set the form data
    let form_data = {
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
