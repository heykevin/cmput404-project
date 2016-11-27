import React from 'react';
import {connect} from 'react-redux';
import Utils from '../utils/utils.js';
import ProfileInfo from '../components/ProfileInfo.jsx';
import AuthorEditForm from '../components/AuthorEditForm.jsx';

import {Button} from 'react-bootstrap';

export class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        console.log(this.props.author);
        return (
            <div className="profile">
                <div className={this.props.showForm
                    ? "invisible"
                    : "visible"}>
                    <ProfileInfo author={this.props.author}/>
                </div>
                <div className={this.props.showForm
                    ? "visible"
                    : "invisible"}>
                    <AuthorEditForm author={this.props.author} className={this.props.showForm
                        ? "visible"
                        : "invisible"}/>

                </div>
                <Button className={this.props.showForm
                    ? "invisible"
                    : "visible"} bsStyle="primary" onClick={this.onClick}>Edit your profile</Button>
            </div>
        );
    }

    onClick(event) {
        this.props.dispatch({type: "auth.showForm", author: this.props.author});
    }

}
// export the connected class
function mapStateToProps(state, props) {

    // pass the state defaultValues
    return {
        author: state.auth.author || Utils.getAuthor(),
        showForm: state.auth.showForm || false
    };
}
export default connect(mapStateToProps)(Profile);
