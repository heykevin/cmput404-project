import React from 'react';
import { connect } from 'react-redux';

import Menu from './Menu.jsx';

export class App extends React.Component
{
    render()
    {
        return (
            <div className="container">
                <div className="row">
                    <Menu loggedIn={this.props.loggedIn}
                        currentlySending={this.props.currentlySending}
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

function mapStateToProps(state) {
    return {
        loggedIn: state.loggedIn,
        currentlySending: state.loggedIn
    };
}
export default connect(mapStateToProps)(App);
