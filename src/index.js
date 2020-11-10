import React from 'react';
import ReactDOM from 'react-dom';
import CacheBuster from './utils/CacheBuster';
import App from './App';

const RootHTML = (
    <CacheBuster>
        <App />
    </CacheBuster>
);

ReactDOM.render(RootHTML, document.getElementById('root'));
