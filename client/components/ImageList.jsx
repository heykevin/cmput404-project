import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {ProgressBar, List, Pagination, ListGroup} from 'react-bootstrap';

import ImageListElement from './ImageListElement.jsx';

export class ImageList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            images: []
        }

        this.props.dispatch({type: 'imagesFetch'});
        this.changePage = this.changePage.bind(this);
    }

    render()
    {
        // render
        if (!this.props.resolved) {
            // show the loading state
            return (<ProgressBar active now={100}/>);
        } else if (this.props.images.length) {
            // pagination
            const per_page = 12, row = 3, row_count = per_page / 3;
            const pages = Math.ceil(this.props.images.length / per_page);
            const current_page = this.props.page;
            const start_offset = (current_page - 1) * per_page;
            let start_count = new Array(row).fill(0);

            return (
                <div className='images'>
                    <ListGroup className="image-group">
                        {this.props.images.map((image, index) => {
                            if (index >= start_offset && start_count[0] < row_count) {
                                start_count[0]++;
                                return (<ImageListElement key={image.id} id={image.id}/>);
                            }
                        })}
                    </ListGroup>
					<ListGroup className="image-group">
						{this.props.images.map((image, index) => {
							if (index >= start_offset + row_count && start_count[1] < row_count) {
								start_count[1]++;
								return (<ImageListElement key={image.id} id={image.id}/>);
							}
						})}
					</ListGroup>
					<ListGroup className="image-group">
						{this.props.images.map((image, index) => {
							if (index >= start_offset + row_count*2 && start_count[2] < row_count) {
								start_count[2]++;
								return (<ImageListElement key={image.id} id={image.id}/>);
							}
						})}
					</ListGroup>
                    <Pagination className="users-pagination pull-right" bsSize="medium" maxButtons={10} first last next prev boundaryLinks items={pages} activePage={current_page} onSelect={this.changePage}/>
                </div>
            );
        } else {
            return (
                <div className="no-posts">
                    <div className="warning-text">
                        You currently do not have any images.
                    </div>
                </div>
            );
        }
    }

    changePage(page)
    {
        this.props.dispatch(push('/page=' + page));
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        images: state.images.list || [],
        page: Number(state.routing.locationBeforeTransitions.query.page) || 1,
        resolved: state.images.resolved || false
    };
}
export default connect(mapStateToProps)(ImageList);
