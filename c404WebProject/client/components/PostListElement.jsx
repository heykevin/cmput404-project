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
    }

    static get propTypes()
    {
        return {id: React.PropTypes.number.isRequired};
    }

    render()
    {
        // get the post element data
        let post, href;
        for (const val of this.props.posts) {
            if (Number(val.id) === Number(this.props.id)) {
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
                    <Button bsSize="xsmall" className={this.props.canEdit ? "visible float-right" : "invisible"} data-id={post.id} data-title={post.title}
                        onClick={this.modalDeleteShow}>
                        Delete <Glyphicon glyph="remove-circle"/>
                    </Button>
                </div>
                <div className="post-info" href={href}>
                    <span>Posted by <strong>{post.author}</strong> on {post.dateTime}</span>
                </div>
                <div className="post-description" href={href}>
                    {post.description}
                </div>
                <div className="post-content" href={href}>
                    {this.props.view
                        ? (post.content.length > 100
                            ? post.content.substring(0, 100) + "..."
                            : post.content)
                        : post.content}
                </div>
                <PostDelete/>
            </ListGroupItem>
        );
    }

    modalDeleteShow(event)
    {
        const post_id = Number(event.target.dataset.id);
        const title = event.target.dataset.title;
        this.props.dispatch({
            type: 'posts.modalDeleteShow',
            id: post_id,
            title: title,
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
