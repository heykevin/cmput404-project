import React, {Component} from 'react';
import PostForm from '../components/PostForm.jsx';

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
        return (<PostForm post={post} isEditMode={false}/>);
    }

}
