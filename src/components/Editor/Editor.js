import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';
import delay from 'delay';

import './Editor.css';
import { startTransition } from '../../redux/actions/viewActions';
import { addToArray } from '../../redux/actions/arrayActions';

const Editor = props => {
    const { startTransition, addToArray } = props;
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
    }, [])

    const addHandler = () => {
        addToArray();
    }

    const exitHandler = async () => {
        setActive(false);
        startTransition('home');
    }

    const buttonSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(200%)'})

    return (
        <div className="editor-container">
            <a.section className="e-buttons" style={buttonSpring}>
                <button className="e-button" onClick={addHandler}>Add</button>
                <button className="e-button">Highlight</button>
                <button className="e-button">Swap</button>
                <button className="e-button">Download</button>
                <button className="e-button" onClick={exitHandler}>Exit</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view
});

export default connect(mapStateToProps, { startTransition, addToArray })(Editor);