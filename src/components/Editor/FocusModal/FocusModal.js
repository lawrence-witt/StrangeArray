import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './FocusModal.css';
import { usePrevious } from '../../../utils/CustomHooks';
import { focusElement, unfocusElements } from '../../../redux/actions/viewActions';

const FocusModal = props => {
    const { opened } = props;
    const { focussedElement, unfocusElements } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, setModalActive] = useState(false);
    const [modalEntering, setModalEntering] = useState(false);
    const prevEntering = usePrevious(modalEntering);

    useEffect(() => {
        opened ? setModalEntering(true) : setModalEntering(false);
    }, [opened]);

    useEffect(() => {
        if(modalEntering) setModalActive(true);
    }, [modalEntering])

    const modalSpring = useSpring({
        transform: modalEntering ? 'translateY(0%)' : 'translateY(-100%)',
        onRest: () => {if(!modalEntering && prevEntering) {
            setModalActive(false);
            unfocusElements();
        }}
    });

    return modalActive ? (
        <a.div className="focus-modal" style={modalSpring}>
            <h2 className="focus-type">{focussedElement.element.type}</h2>
            <p className="focus-content">{focussedElement.element.content}</p>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    focussedElement: state.view.focussedElement
});

export default connect(mapStateToProps, { focusElement, unfocusElements })(FocusModal);