import React from 'react';
import {connect} from 'react-redux';
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';

export class AuthorEditForm extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            firstName: 'Tom',
            lastName: 'Lee',
            github: 'Tom.git',
            bios: 'Likes tea'
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBiosChange = this.handleBiosChange.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.firstName, this.state.lastName, this.state.github, this.state.bios);
        console.log('test');
        this.props.dispatch({firstName: this.state.firstName,
            lastName: this.state.lastName,
            github: this.state.github,
            bios: this.state.bios
        });
        // this.onSubmit(this.state.firstName, this.state.lastName);
    }

    handleFirstNameChange(event) {
        console.log(this.state.firstName + " changed to " + event.target.value);
        let firstName = event.target.value;
        this.setState({firstName: firstName});
    }

    handleLastNameChange(event) {
        let lastName = event.target.value;
        this.setState({lastName: lastName});
    }

    handleGithubChange(event) {
        let github = event.target.value;
        this.setState({github: github});
    }

    handleBiosChange(event) {
        let bios = event.target.value;
        this.setState({bios: bios});
    }

    render() {
        // Need to add SERVERONLY to
        return (
            <div className="author-edit-form">
                <Form onSubmit={this.onSubmit}>
                    <ControlLabel> First name </ControlLabel>
                    <FormControl
                        onChange = {this.handleFirstNameChange}
                        id="firstNameEdit"
                        type="text"
                        value={this.state.firstName}
                        />
                    <ControlLabel> Last name </ControlLabel>
                    <FormControl
                        onChange = {this.handleLastNameChange}
                        id="lastNameEdit"
                        type="text"
                        value={this.state.lastName}
                        />
                    <ControlLabel> Github account </ControlLabel>
                    <FormControl
                        onChange = {this.handleGithubChange}
                        id="githubEdit"
                        type="text"
                        value={this.state.github}
                        />
                    <ControlLabel> Bios </ControlLabel>
                    <FormControl
                        onChange = {this.handleBiosChange}
                        id="biosEdit"
                        type="text"
                        value={this.state.bios}
                        />
                    <Button type = "submit">
                        Submit Changes
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
        firstName: state.firstName,
        lastName: state.lastName,
        github: state.github,
        bios: state.bios
    };


    // pass the state values
    return {
        form_data,
    };
}
export default connect(mapStateToProps)(AuthorEditForm);
