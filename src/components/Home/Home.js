import React, { useState, useEffect } from 'react';
import { a, useSpring } from 'react-spring';
import { connect } from 'react-redux';

import './Home.css';
import plus from '../../assets/svgs/plus.svg';
import upload from '../../assets/svgs/upload.svg';
import github from '../../assets/svgs/github-outline.svg';
import ittLogo from '../../assets/svgs/itt-logo.svg';
import UploadModal from './UploadModal/UploadModal';
import { startTransition } from '../../redux/actions/viewActions';
import { setCustomUserArray } from '../../redux/actions/stackActions';

const Home = props => {
    const { startTransition, setCustomUserArray, userUpload } = props;
    const [active, setActive] = useState(false);
    const [uploadModal, toggleUploadModal] = useState(false);
    const [buttonSelect, setButtonSelect] = useState('');

    // On Mount
    useEffect(() => {
        setActive(true);
        setCustomUserArray(null, true);
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
                <img 
                    className={`h-button ${buttonSelect === 'create' ? 'selected' : ''}`} 
                    src={plus} 
                    onClick={() => {
                        createHandler();
                        setButtonSelect('create');
                    }}></img>
                <img 
                    className={`h-button ${buttonSelect === 'upload' ? 'selected' : ''}`} 
                    src={upload} 
                    onClick={() => {
                        uploadHandler();
                        buttonSelect === 'upload' ?
                            setButtonSelect('') : 
                            setButtonSelect('upload');
                    }}></img>
                <img className="h-button" src={github}></img>
                <img className="h-button" src={ittLogo}></img>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    userUpload: state.view.userUpload
});

export default connect(mapStateToProps, { startTransition, setCustomUserArray })(Home);