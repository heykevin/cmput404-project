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
        // currentState = getState();
        // if (currentState === NULL || undefined){
            console.log("Default information");
            this.state = {
                firstName: '',
                lastName: '',
                github: '',
                bios: ''
            }
        // }
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleGithubChange = this.handleGithubChange.bind(this);
        this.handleBiosChange = this.handleBiosChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        console.log("AuthorEditForm onSubmit", this.state.firstName, this.state.lastName, this.state.github, this.state.bios);
        console.log('dispatch props to store');

        //Method one Error --> method not defined
        this.props.dispatch({
            type: "authEdit",
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            github: this.state.github,
            bios: this.state.bios
        });
        //Method two
        //code from http://stackoverflow.com/questions/27617020/how-to-pass-a-prop-into-a-component
        // $.ajax({
        //     url: 'this.props.url',
        //     dataType: 'json',
        //     type: 'PUT',
        //     data: state,
        //     success: function(state){
        //         this.setState({
        //             firstName: state.firstName,
        //             lastName: state.lastName,
        //             github: state.github,
        //             bios: state.bios
        //         }.bind(this),
        //         error: function (xhr, status, err) {
        //             console.error(this.props.url, status, err.toString());
        //         }.bind(this);
        //     }
        // });

    }

    handleFirstNameChange(event) {
        let firstName = event.target.value;
        this.setState({firstName: firstName});
        console.log("Author setting", this.state);

    }

    handleLastNameChange(event) {
        let lastName = event.target.value;
        this.setState({lastName: lastName});
        console.log("Author setting", this.state);
    }

    handleGithubChange(event) {
        let github = event.target.value;
        this.setState({github: github});
        console.log("Author setting", this.state);

    }

    handleBiosChange(event) {
        let bios = event.target.value;
        this.setState({bios: bios});
        console.log("Author setting", this.state);
    }

    render() {
        // Need to add SERVERONLY to
        console.log("Author setting", this.state);

        return (
            <div className="author-edit-form">
                <Form onSubmit={this.onSubmit.bind(this)}>
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
