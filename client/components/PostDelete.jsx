import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import Utils from '../utils/utils.js';

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
        switch (this.props.modal_delete.status) {
            case 0:
                return (
                    <Modal show={true}>
                        <Modal.Body>
                            >໒( •́ ∧ •̀ )७ Deleting <i className="fa fa-spinner fa-spin"></i>                        
                        </Modal.Body>
                    </Modal>
                );
            case 1:
                return (
                    <Modal show={true}>
                        <Modal.Header>
                            <Modal.Title>
                                It's Gone
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Well... We hope you've said your farewell to your post... because it's utterly gone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="success" onClick={this.modalDeleteHide}>I have</Button>
                        </Modal.Footer>
                    </Modal>
                );
            case -1:
                return (
                    <Modal show={true}>
                        <Modal.Header>
                            <Modal.Title>
                                ( ب_ب )
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Sorry, we are unable to delete your post at this moment. Please try again later.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="success" onClick={this.modalDeleteHide}>Okay</Button>
                        </Modal.Footer>
                    </Modal>
                );
            default:
                return (
                    <Modal show={this.props.modal_delete.show}>
                        <Modal.Header>
                            <Modal.Title>
                                (╭ರ_•́)
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete <strong>{this.props.modal_delete.title}</strong>?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.modalDeleteHide}>No</Button>
                            <Button bsStyle="primary" onClick={this.postDelete}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                );
        }
    }

    modalDeleteHide(event)
    {
        this.props.dispatch({type: 'postsGetPosts', method: "author", authorId: Utils.getAuthor().id});

        this.props.dispatch({
            type: 'posts.modalDeleteHide',
        });
    }

    postDelete(event)
    {
        // switch to sending status
        this.props.dispatch({
            type: 'posts.sendingDeleteRequest'
        });

        // delete the post with the api
        this.props.dispatch({
            type: 'postsDeletePost',
            id: this.props.modal_delete.id,
        });
    }
}

// export the connected class
function mapStateToProps(state) {
    return {
        modal_delete: (state.posts.modal && state.posts.modal.list_delete) ? state.posts.modal.list_delete : {
            show: false,
            id: 0,
            title: ''
        },
    };
}
export default connect(mapStateToProps)(PostDelete);
