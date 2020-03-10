import React, { useState, useEffect } from 'react';
import { a, useSpring } from 'react-spring';
import { connect } from 'react-redux';

import './Home.css';
import UploadModal from './UploadModal/UploadModal';
import { startTransition } from '../../redux/actions/viewActions';
import { setCustomUserArray } from '../../redux/actions/stackActions';

const Home = props => {
    const { startTransition, setCustomUserArray, userUpload } = props;
    const [active, setActive] = useState(false);
    const [uploadModal, toggleUploadModal] = useState(false);

    // On Mount
    useEffect(() => {
        setActive(true);
        //setCustomUserArray(null, true);
    }, []);

    // Initiate transition once user upload is stored in state
    useEffect(() => {
        if(userUpload) createHandler();
    }, [userUpload]);

    // Create Handler
    const createHandler = () => {
        setActive(false);
        toggleUploadModal(false);
        startTransition('edit');
    }

    // Upload Handler
    const uploadHandler = () => {
        toggleUploadModal(!uploadModal);
    }

    const titleSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(-200%)'});
    const buttonSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(200%)'});

    return (
        <div className="home-container">
            <a.h1 className="title" style={titleSpring}>strange[Array]</a.h1>
            <UploadModal opened={uploadModal}/>
            <a.section className="h-buttons" style={buttonSpring}>
                <button className="h-button" onClick={createHandler}>Create</button>
                <button className="h-button" onClick={uploadHandler}>Upload</button>
                <button className="h-button">Github</button>
                <button className="h-button">itt.dev</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    userUpload: state.view.userUpload
});

export default connect(mapStateToProps, { startTransition, setCustomUserArray })(Home);