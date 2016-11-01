import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Glyphicon } from 'react-bootstrap';

export class UserListElement extends React.Component
{
    constructor(props)
    {
        super(props);

        // bind <this> to the event method
        this.modalDeleteShow = this.modalDeleteShow.bind(this);
    }

    render()
    {
        // get the user element data
        let user;
        const users = this.props.view === "myfriends" ? this.props.friends : this.props.users;
        for (const val of users) {
            if (val.id === this.props.id) {
                user = val;
                break;
            }
        }

        // render
        return (
            <tr>
                <td>{user.displayName}</td>
                <td>{user.bio ? user.bio : user.displayName + " is rather private. So no bio is available."}</td>
                <td>Already Friends</td>
            </tr>
        );
    }

    modalDeleteShow(event)
    {
        const user_id = Number(event.target.dataset.id);
        const username = event.target.dataset.username;
        this.props.dispatch({
            type: 'users.modalDeleteShow',
            id: user_id,
            username: username,
        });
    }
}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        users: state.users.users || [],
        friends: state.users.friends || [],
        id: own_props.id,
    }
}
export default connect(mapStateToProps)(UserListElement);
