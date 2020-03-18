import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './SwapModal.css';
import { useModal } from '../../../utils/CustomHooks';
import { resetSwap } from '../../../redux/actions/viewActions';
import { swapStack } from '../../../redux/actions/stackActions';

const SwapModal = props => {
    const { opened } = props;
    const { pendingSwap, resetSwap, swapStack } = props;

    /* MODAL TRANSITION IN/OUT AND MOUNTING/UNMOUNTING */
    const [modalActive, modalSpring] = useModal(opened, [resetSwap], [resetSwap]);

    /* SUBMIT SWAP */
    function handleSwap() {
        if(pendingSwap[0].element.type && pendingSwap[1].element.type) {
            swapStack();
            resetSwap();
        }
    }

    return modalActive ? (
        <a.div className="swap-modal" style={modalSpring}>
            <h2 className="swap-title">Select Two Elements To Swap</h2>

            <div className="swap-selection-container">
                {pendingSwap[0].element.type ? (
                    <div className="swap-selection one">
                    <p className="ss-type">{pendingSwap[0].element.type}</p>
                    <p className="ss-content">{pendingSwap[0].element.type === 'Array' ? 
                        pendingSwap[0].path : pendingSwap[0].element.content}</p>
                    </div>
                ) : null}
                
                {pendingSwap[1].element.type ? (
                    <div className="swap-selection two">
                    <p className="ss-type">{pendingSwap[1].element.type}</p>
                    <p className="ss-content">{pendingSwap[1].element.type === 'Array' ? 
                        pendingSwap[1].path : pendingSwap[1].element.content}</p>
                    </div>
                ) : null}
            </div>
            
            <div className="swap-button-container">
                {pendingSwap[0].element.type && pendingSwap[1].element.type ? (
                    <button className="swap-button" onClick={handleSwap}>
                        Confirm
                    </button>
                ): null}
            </div>
        </a.div>
    ) : null;
}

const mapStateToProps = state => ({
    pendingSwap: state.view.pendingSwap
});

export default connect(mapStateToProps, { resetSwap, swapStack })(SwapModal);