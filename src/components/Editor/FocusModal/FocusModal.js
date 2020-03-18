import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './FocusModal.css';
import { useModal } from '../../../utils/CustomHooks';
import { focusElement, unfocusElements } from '../../../redux/actions/viewActions';

const FocusModal = props => {
    const { opened } = props;
    const { focussedElement, unfocusElements } = props;
    const { type, content } = focussedElement.element;
    const { path } = focussedElement;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [], [unfocusElements]);

    return modalActive ? (
        <a.div className={`focus-modal ${type}`} style={modalSpring}>
            <h2 className="focus-type">{type}</h2>
            <p className="focus-path">{`[${path.join('] [')}]`}</p>
            <p className="focus-content">{content}</p>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    focussedElement: state.view.focussedElement
});

export default connect(mapStateToProps, { focusElement, unfocusElements })(FocusModal);