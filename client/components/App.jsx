import React from 'react';
import { connect } from 'react-redux';

import Menu from './Menu.jsx';

export default class App extends React.Component
{
    render()
    {
        return (
            <div className="container">
                <div className="row">
                    <Menu
                        history={this.props.history}
                        dispatch={this.props.dispatch}
                        location={this.props.location}/>
                </div>
                <div className="row">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
