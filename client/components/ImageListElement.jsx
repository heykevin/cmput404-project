import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Button, ListGroupItem} from 'react-bootstrap';

export class ImageListElement extends React.Component
{
    render()
    {
        // get the post element data
        let image, href, time, content;

		if (this.props.images.length > 0){
            for (const val of this.props.images) {
                if (val.id === this.props.id) {
                    image = val;
                    break;
                }
            }
        }

        if (!image) {
            return null;
        }
        // render
        return (
                <ListGroupItem className="image" data-id={image.id} href={image.origin} target="_blank">
					<img src={image.origin}/>
                </ListGroupItem>
        );
    }
}

// export the connected class
function mapStateToProps(state, own_props) {
    return {
        images: state.images.list || [],
        id: own_props.id
    }
}
export default connect(mapStateToProps)(ImageListElement);
