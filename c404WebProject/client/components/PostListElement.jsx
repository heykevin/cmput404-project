import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, Glyphicon, ListGroupItem} from 'react-bootstrap';

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
        let post, href;
        for (const val of this.props.posts) {
            if (val.id === this.props.id) {
                post = val;
                href = this.props.preview ? post.origin : "#";
                break;
            }
        }
        // render
        return (
            <ListGroupItem data-id={post.id} >
                <div className="post-title">
                    <span className="post-title-font">{post.title}</span>
                    <div className={this.props.canEdit ? "visible float-right" : "invisible"}>
                        <Button bsSize="xsmall" data-id={post.id}
                            onClick={this.redirectToEditor}>
                            Edit <Glyphicon glyph="edit"/>
                        </Button>
                        <Button bsSize="xsmall"  data-id={post.id} data-title={post.title}
                            onClick={this.modalDeleteShow}>
                            Delete <Glyphicon glyph="remove-circle"/>
                        </Button>
                    </div>
                </div>
                <div className="post-info" href={href}>
                    <span>Posted by <strong>{post.author}</strong> on {post.dateTime}</span>
                </div>
                <div className="post-description" href={href}>
                    {post.description}
                </div>
                <div className={this.props.preview ? "invisible" : "visible post-content"} href={href}>
                    // TODO: This content will need a rendering function that shows content
                    // as markdown or simpletext
                    {post.content}
                </div>
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
