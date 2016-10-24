import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Glyphicon, ListGroupItem} from 'react-bootstrap';

export class PostListElement extends React.Component
{
    constructor(props)
    {
        super(props);

    }

    static get propTypes()
    {
        return {
            id: React.PropTypes.number.isRequired,
        };
    }

    render()
    {
        // get the post element data
        let post;
		console.log("PostListElement 25: " + this.props.posts);
        for (const val of this.props.posts) {
            if (Number(val.id) === Number(this.props.id)) {
                post = val;
                break;
            }
        }

        // render
        return (
			<ListGroupItem href={post.origin} data-id={post.id}>
				<h4> {post.title}</h4>
				<div className="post-info">
					<span>Posted by <strong>{post.author}</strong> on {post.dateTime}</span>
				</div>
				<div className="post-description">
					{post.description}
				</div>
				<div className="post-content">
					{post.content}
				</div>
			</ListGroupItem>
        );
    }


}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        posts: state.posts.list || [],
        id: own_props.id,
    }
}
export default connect(mapStateToProps)(PostListElement);
