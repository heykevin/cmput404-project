import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PostDelete from './PostDelete.jsx';
export class PostListElement extends React.Component
{
    constructor(props)
    {
        super(props);
        this.modalDeleteShow = this.modalDeleteShow.bind(this);
        this.redirectToEditor = this.redirectToEditor.bind(this);
    }

    render()
    {
        // get the post element data
        let post, href, time, content;

        if (this.props.view === "view" && ! (this.props.posts instanceof Array)) {
            post = this.props.posts;
        } else if (this.props.posts.length > 0){
            for (const val of this.props.posts) {
                if (val.id === this.props.id) {
                    post = val;
                    break;
                }
            }
        }

        if (!post) {
            return null;
        }

        time = new Date(post.published).toString();
        href = this.props.preview ? '/posts/' + post.id : "#";
        content = post.contentType.toLowerCase() === "text/markdown" ?  <ReactMarkdown source={post.content} /> : post.content;
        // render
        return (
                <ListGroupItem data-id={post.id}>
                    <div className={this.props.canEdit ? "visible float-right buttons" : "invisible"}>
                        <Button bsSize="xsmall" data-id={post.id}
                            onClick={this.redirectToEditor}>
                            Edit <Glyphicon data-id={post.id} glyph="edit"/>
                        </Button>
                        <Button bsSize="xsmall"  data-id={post.id} data-title={post.title}
                            onClick={this.modalDeleteShow}>
                            Delete <Glyphicon data-id={post.id} data-title={post.title} glyph="remove-circle"/>
                        </Button>
                    </div>
                    <a href={href} className="post-body">
                        <div className="post-title">
                            <span className="post-title-font">{post.title}</span>
                        </div>
                        <div className="post-info">
                            <span>Posted by <strong>{post.author.displayName}</strong> on {time}</span>
                        </div>
                        <div className="post-description">
                            {post.description}
                        </div>
                        <div className={this.props.preview ? "invisible" : "visible post-content"}>
                            {content}
                        </div>
                    </a>
                    <PostDelete/>
                </ListGroupItem>
        );
    }

    redirectToEditor(event)
    {
        this.props.dispatch({
            type: "postsEditPostRedirect",
            id: event.target.dataset.id
        });
    }

    modalDeleteShow(event)
    {
        this.props.dispatch({
            type: 'posts.modalDeleteShow',
            id: event.target.dataset.id,
            title: event.target.dataset.title
        });
    }

}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        posts: state.posts.list || [],
        id: own_props.id
    }
}
export default connect(mapStateToProps)(PostListElement);
