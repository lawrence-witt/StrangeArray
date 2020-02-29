import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './Editor.css';
import { startTransition, toggleDeletion } from '../../redux/actions/viewActions';
import { addToStack } from '../../redux/actions/stackActions';

const Editor = props => {
    const { deletionActive, startTransition, toggleDeletion, addToStack } = props;
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
    }, [])

    const addHandler = () => {
        addToStack();
    }

    const deleteHandler = () => {
        if(deletionActive) {
            toggleDeletion(false);
        } else {
            toggleDeletion(true);
        }
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
                <button className="e-button" onClick={deleteHandler}>{deletionActive ? 'Cancel' : 'Delete'}</button>
                <button className="e-button">Swap</button>
                <button className="e-button">Download</button>
                <button className="e-button" onClick={exitHandler}>Exit</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    deletionActive: state.view.deletionActive
});

export default connect(mapStateToProps, { startTransition, toggleDeletion, addToStack })(Editor);