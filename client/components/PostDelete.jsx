import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

export class PostDelete extends React.Component
{
    constructor(props)
    {
        super(props);

        // bind <this> to the event method
        this.modalDeleteHide = this.modalDeleteHide.bind(this);
        this.postDelete = this.postDelete.bind(this);
    }

    render()
    {
        return (
            <Modal show={this.props.modal_delete.show}>
                <Modal.Header>
                    <Modal.Title>
                        Are you sure you want to delete <strong>{this.props.modal_delete.title}</strong>?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button onClick={this.modalDeleteHide}>No</Button>
                    <Button bsStyle="primary" onClick={this.postDelete}>Yes</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    modalDeleteHide(event)
    {
        this.props.dispatch({
            type: 'posts.modalDeleteHide',
        });
    }

    postDelete(event)
    {
        // delete the post with the api
        this.props.dispatch({
            type: 'postsDeletePost',
            id: this.props.modal_delete.id,
        });

        // hide the modal
        this.props.dispatch({
            type: 'posts.modalDeleteHide',
        });
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        modal_delete: (state.posts.modal && state.posts.modal.list_delete) ? state.posts.modal.list_delete : {
            show: false,
            id: 0,
            title: '',
        },
    };
}
export default connect(mapStateToProps)(PostDelete);
