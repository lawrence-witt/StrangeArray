// Dependencies
import React, { useState } from 'react';

// Imported Sheets
import Home from '../Home/Home';
import Editor from '../Editor/Editor';

const Overlay = () => {

    const [viewState, setViewState] = useState('home');
  
    const updateViewState = newView => {
      setViewState(newView);
    }
  
    return (
        <>
          {viewState === 'home' ? <Home updateViewState={updateViewState}/> : <Editor updateViewState={updateViewState}/>}
        </>
    );
}

export default Overlay;