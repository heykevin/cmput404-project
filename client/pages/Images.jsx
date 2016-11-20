import React from 'react';

import ImageUploadForm from '../components/ImageUploadForm.jsx';
import Utils from '../utils/utils.js';

export default class Home extends React.Component
{
    render()
    {
        const authorId = Utils.getAuthor().id;
        return (<ImageUploadForm />);
    }
}
