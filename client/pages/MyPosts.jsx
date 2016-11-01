import React from 'react';

import PostList from '../components/PostList.jsx';

export default class Home extends React.Component
{
    render()
    {
        // http://service/author/{AUTHOR_ID}/posts (all posts made by {AUTHOR_ID} visible to the currently authenticated user)
        return (<PostList method="author" preview={true} canEdit={true} authorId={this.props.authorId}/>);
    }
}
