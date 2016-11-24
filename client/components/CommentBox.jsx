import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PostDelete from './PostDelete.jsx';
import Utils from '../utils/utils.js';


//https://github.com/reactjs/react-tutorial/blob/master/public/scripts/example.js

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
      try {
          var commentNodes = this.props.data.map(function(comment) {
              return (
                  <Comment author={comment.author} key={comment.id}>
                      {comment.text}
                  </Comment>
              );
          });
      }
      catch (err){
          var commentNodes = "No comments yet"
      }
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

export class CommentBox extends React.Component{
  loadCommentsFromServer() {

    this.props.dispatch({
        type: "commentsGetComment",
        postId: this.props.postId
    });

}
 componentDidMount() {
   this.loadCommentsFromServer();
   setInterval(this.loadCommentsFromServer, 1000);
}
  render() {
      return(
          <div>
              <h1>Comments</h1>
              <CommentLists/>
        </div>
      );
  }
}

// export the connected class
function mapStateToProps(state, props) {
    // pass the state defaultValues
    return {
        comment: state.comment,
    }
}
export default connect(mapStateToProps)(CommentBox);
