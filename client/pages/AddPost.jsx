import React, {Component} from 'react';
import PostForm from '../components/PostForm.jsx';
import Notifications from 'react-notify-toast';

export default class AddPost extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render()
    {
		let post = {
            title: "",
            description: "",
            content: "",
            visibility: "PUBLIC",
            isMarkdownContent: true
        };
        return (<div><PostForm post={post} isEditMode={false}/><Notifications /></div>);
    }

}
