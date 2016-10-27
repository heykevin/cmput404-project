import React from 'react';
import {
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';

export class AuthorEditForm extends React.Component
{

    constructor()
    {
        super();
        this.state = {
            firstName: 'Tom',
            lastName: 'Lee',
            github: 'Tom.git',
            bios: 'Likes tea'
        }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLamNameChange = this.handleLamNameChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBiosChange = this.handleBiosChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.firstName, this.state.lastName, this.state.github, this.state.bios);
        console.log('test');
        this.props.onSubmit("this sucks");
        this.props.dispatch({type: "updateAuthor"})
        // this.onSubmit(this.state.firstName, this.state.lastName);
    }

    handleFirstNameChange(event) {
        let firstName = event.target.value;
        this.setState({firstName: firstName});
        console.log(this.props.firstname);
    }

    handleLastNameChange(event) {
        let lastName = event.target.value;
        this.setState({lastName: lastName});
        console.log(this.props.lastname);
    }

    handleGithubChange(event) {
        let github = event.target.value;
        this.setState({github: github});
        console.log(this.props.github);
    }

    handleBiosChange(event) {
        let bios = event.target.value;
        this.setState({bios: bios});
        console.log(this.props.bios);
    }

    render()
    {
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
// export default connect(mapStateToProps)(AUthorEditForm);
