import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { a, useSpring } from 'react-spring';

import './SwapModal.css';
import { usePrevious } from '../../../utils/CustomHooks';
import { resetSwap } from '../../../redux/actions/viewActions';
import { swapStack } from '../../../redux/actions/stackActions';

const SwapModal = props => {
    const { opened } = props;
    const { pendingSwap, resetSwap, swapStack } = props;



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
            resetSwap();
        }}
    });

    /* SUBMIT SWAP */
    // This currently works except for arrays which break and turn into primcubes.
    // The reason being, you are not inserting an actual array but an element object
    function handleSwap() {
        if(pendingSwap[0].element && pendingSwap[1].element) {
            swapStack();
            resetSwap();
        }
    }

    return modalActive ? (
        <a.div className="swap-modal" style={modalSpring}>
            <h2 className="swap-title">Select Two Elements To Swap</h2>

            <div className="swap-selection-container">
                <div className="swap-selection one">
                    <p>{pendingSwap[0].element ? pendingSwap[0].element.type : ''}</p>
                    <p>{pendingSwap[0].element && pendingSwap[0].element.type === 'Array' ? 
                        pendingSwap[0].path :
                        pendingSwap[0].element ? 
                        pendingSwap[0].element.content : ''}</p>
                </div>
                <div className="swap-selection two">
                    <p>{pendingSwap[1].element ? pendingSwap[1].element.type : ''}</p>
                    <p>{pendingSwap[1].element && pendingSwap[1].element.type === 'Array' ? 
                        pendingSwap[1].path :
                        pendingSwap[1].element ? 
                        pendingSwap[1].element.content : ''}</p>
                </div>
            </div>
            
            <div className="swap-button-container">
                {pendingSwap[0].element && pendingSwap[1].element ? (
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