import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ProgressBar} from 'react-bootstrap';
import Notifications from 'react-notify-toast';

import PostForm from '../components/PostForm.jsx';

export class EditPost extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render()
    {

        if (this.props.shouldRequestPost && this.props.resolved === false && this.props.id) {
            this.props.dispatch({type: 'postsGetPosts', method: "post", postId: this.props.id, comments: false});
            return (<div><ProgressBar active now={100}/><Notifications /></div>);
        }

		return (<div><PostForm post={this.props.post} isEditMode={true}/><Notifications /></div>);

    }

}

function composeState(post, isEditMode) {
    return {
        post: post,
        disableButton: !isEditMode,
        isEditMode: isEditMode,
    };
}

function mapStateToProps(state) {
    if (state.posts.shouldRequestPost === false) {
        return composeState(state.posts.postInEdit, true);
    } else if (state.posts.shouldRequestPost && state.posts.resolved) {
        return composeState(state.posts.list, true);
    } else if (state.posts.shouldRequestPost && !state.posts.resolved) {
        return {id: state.posts.id, resolved: false};
    } else {
        return composeState({}, false);
    }
}
export default connect(mapStateToProps)(EditPost);
