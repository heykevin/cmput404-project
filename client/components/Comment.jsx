import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PostDelete from './PostDelete.jsx';
import Utils from '../utils/utils.js';


//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

export default class Comment extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render() {
        console.log("Time to render some COMMENT");
        return (
            <div className="comment" id={this.props.id}>
                <h1>COMMENT</h1>
            </div>
        );
    }
}
