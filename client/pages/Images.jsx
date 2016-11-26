import React from 'react';
import {connect} from 'react-redux';

import ImageUploadForm from '../components/ImageUploadForm.jsx';
import ImageList from '../components/ImageList.jsx';
import Utils from '../utils/utils.js';

export class Images extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (

            <div>
                <div className={(this.props.sending
                    ? "visible"
                    : "invisible") + " hide-yall-kids-hide-yall-wife"}>
                    <i className="fa fa-spinner fa-spin"></i>
                </div>
                <ImageUploadForm/>
                <ImageList/>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {sending: state.images.sending}
}

export default connect(mapStateToProps)(Images);
