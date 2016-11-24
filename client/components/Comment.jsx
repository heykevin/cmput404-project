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
        this.state = {
            author: '',
            content: ''
        }
    }

  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.comments.author}
        </h2>
        <h2>
            {this.props.comments.content}
        </h2>
      </div>
    );
  }
}
