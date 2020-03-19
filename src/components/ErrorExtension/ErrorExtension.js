import React from 'react';
import { a, useSpring } from 'react-spring';

import './ErrorExtension.css';
import close from '../../assets/svgs/close.svg';

const ErrorExtension = props => {
    const { errorObject, errorSetter } = props;
    const { active, message } = errorObject;

    const errorSpring = useSpring({
        transform: active ? 'scaleY(100%) translateY(100%)' : 'scaleY(0%) translateY(100%)',
    })

    return (
        <a.div className="error-extension" style={errorSpring}>
            <div className="error-message-container">
                <p className="error-message">{message}</p>
            </div>
            <div className="error-button-container">
                <img 
                    className="error-close"
                    src={close} 
                    onClick={() => errorSetter({active: false, message})}></img>
            </div>
        </a.div>
    )
}

export default ErrorExtension;