import React from 'react';
import {connect} from 'react-redux';
import Utils from '../utils/utils.js';
import ProfileInfo from '../components/ProfileInfo.jsx';
import AuthorEditForm from '../components/AuthorEditForm.jsx';
import {
    Button
} from 'react-bootstrap';

export class Profile extends React.Component {

constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
}

    render() {
        return(
            <div>
                <ProfileInfo author={this.props.author} className = {this.props.showForm? "invisible" : "visible"}/>
                <AuthorEditForm author={this.props.author} className = {this.props.showForm? "visible" : "invisible"}/>
                <Button bsStyle="primary" href="/settings">Edit your profile</Button>
            </div>
        );
    }

    onClick(event) {
        this.props.dispatch({
            type:"auth.showForm",
            author:this.props.author
        })
    }


}
// export the connected class
function mapStateToProps(state, props) {

    // pass the state defaultValues
    return {
        author:state.author||Utils.getAuthor(),
        showForm:state.showForm||false
    };
}
export default connect(mapStateToProps)(ProfileInfo);
