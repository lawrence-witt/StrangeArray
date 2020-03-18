import React from 'react';
import { a, useSpring } from 'react-spring';

import './ErrorExtension.css';

const ErrorExtension = props => {
    const { errorObject, errorSetter } = props;
    const { active, message } = errorObject;

    const errorSpring = useSpring({
        transform: active ? 'scaleY(100%) translateY(100%)' : 'scaleY(0%) translateY(100%)',
        /* transformOrigin: 'top' */
        /* onRest: () => {
            if(message && !active) {
                console.log('error clean up');
                errorSetter({active, message: ''});
            }
        } */
    })

    return (
        <a.div className="error-extension" style={errorSpring}>
            <div className="error-message-container">
                <p className="error-message">{message}</p>
            </div>
            <div className="error-button-container">
                <button className="error-close" onClick={() => errorSetter({active: false, message})}>X</button>
            </div>
        </a.div>
    )
}

export default ErrorExtension;