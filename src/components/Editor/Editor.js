import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';
import delay from 'delay';

import './Editor.css';

const Editor = props => {

    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
    }, [])

    const transitionView = async () => {
        setActive(false);
        await delay(300);
        props.updateViewState('home');
    }

    const buttonSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(200%)'})

    return (
        <div className="editor-container">
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button">Delete</button>
                <button className="e-button">Highlight</button>
                <button className="e-button">Swap</button>
                <button className="e-button">Download</button>
                <button className="e-button" onClick={transitionView}>Exit</button>
            </a.section>
        </div>
    )
}

export default Editor;