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

export class AuthorEditForm extends React.Component {
    //currentState = getState();

    constructor(props)
    {
        super(props);
        this.state = this.props.author;
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.first_name, this.state.last_name, this.state.email, this.state.github, this.state.bio);
        console.log("dispatch action authEdit");
        event.preventDefault();
        this.props.dispatch({
            type: "authEdit",
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            github: this.state.github,
            bio: this.state.bio
        });
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
        let github = event.target.value;
        this.setState({github: github});
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
                        defaultValue={this.props.author.first_name}
                        />
                    <ControlLabel> Last name </ControlLabel>
                    <FormControl
                        onChange = {this.handleLastNameChange}
                        id="last_nameEdit"
                        type="text"
                        defaultValue={this.props.author.last_name}
                        />
                    <ControlLabel> Email </ControlLabel>
                    <FormControl
                        onChange = {this.handleEmailChange}
                        id="emailEdit"
                        type="email"
                        defaultValue={this.props.author.email}
                        />
                    <ControlLabel> Github account </ControlLabel>
                    <FormControl
                        onChange = {this.handleGithubChange}
                        id="githubEdit"
                        type="text"
                        defaultValue={this.props.author.github}
                        />
                    <ControlLabel> Bios </ControlLabel>
                    <FormControl
                        onChange = {this.handleBioChange}
                        id="bioEdit"
                        type="text"
                        defaultValue={this.props.author.bio}
                        />
                    <Button bsStyle="primary" type="submit">
                        Submit
                    </Button>
                </Form>

            </div>
        );
    }
}
// export the connected class
function mapStateToProps(state, props) {

    // pass the state defaultValues
    return {
        author: state.author || Utils.getAuthor(),
        showForm: state.auth.showForm || false
    };
}
export default connect(mapStateToProps)(AuthorEditForm);
