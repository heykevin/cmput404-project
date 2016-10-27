import React from 'react';
import AuthorEditForm from '../components/AuthorEditForm.jsx';

export default class AuthorEdit extends React.Component
{
    // onSubmit(event) {
    //     console.log(event);
    // }
    render()
    {
        // Need to add SERVERONLY to
        return(
            <div className="page-edit">
                <span>Author Edit Page</span>
                <AuthorEditForm/>
            </div>
        );
    }
}
