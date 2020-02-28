// Dependencies
import React, { useState } from 'react';
import { connect } from 'react-redux';

// Imported Sheets
import Home from '../Home/Home';
import Editor from '../Editor/Editor';

const Overlay = props => {
    const { view } = props;
  
    return (
          view === 'home' ? <Home /> : <Editor />
    );
}

const mapStateToProps = state => ({
  view: state.view.view
});

export default connect(mapStateToProps)(Overlay);