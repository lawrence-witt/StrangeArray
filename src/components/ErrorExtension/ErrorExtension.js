import React from 'react';
import { a, useSpring } from 'react-spring';

import './ErrorExtension.css';
import Close from '../../assets/svgs/Close';

const ErrorExtension = props => {
    const { errorObject, errorSetter } = props;
    const { active, message } = errorObject;

    const errorSpring = useSpring({
        transform: active ? 'scaleY(1) translateY(100%)' : 'scaleY(0) translateY(100%)',
    });

    return (
        <a.div className="error-extension" style={errorSpring}>
            <div className="error-message-container">
                <p className="error-message">{message}</p>
            </div>
            <div className="error-button-container">
                <Close 
                    className="error-close"
                    onClick={() => errorSetter({active: false, message})}/>
            </div>
        </a.div>
    )
}

export default ErrorExtension;