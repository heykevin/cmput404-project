import React from 'react';

import PostList from '../components/PostList.jsx';
import Utils from '../utils/utils.js';

export default class Home extends React.Component
{
    render()
    {
        const authorId = Utils.getAuthor().id;
        return (<PostList method="author" preview={true} authorId={authorId} canEdit={true}/>);
    }
}
