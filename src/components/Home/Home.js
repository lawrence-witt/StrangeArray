import React, { useState, useEffect } from 'react';
import { a, useSpring } from 'react-spring';
import { connect } from 'react-redux';

import './Home.css';
import Plus from '../../assets/svgs/Plus';
import Upload from '../../assets/svgs/Upload';
import Github from '../../assets/svgs/Github';
import IttLogo from '../../assets/svgs/IttLogo';
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
            <a.h1 className="title" style={titleSpring}>Strange[Array]</a.h1>
            <UploadModal opened={uploadModal}/>
            <a.section className="h-buttons" style={buttonSpring}>
                <Plus 
                    className={`h-button ${buttonSelect === 'create' ? 'selected' : ''}`}  
                    onClick={() => {
                        createHandler();
                        setButtonSelect('create');
                    }}/>
                <Upload 
                    className={`h-button ${buttonSelect === 'upload' ? 'selected' : ''}`} 
                    onClick={() => {
                        uploadHandler();
                        buttonSelect === 'upload' ?
                            setButtonSelect('') : 
                            setButtonSelect('upload');
                    }}/>
                <a href="https://github.com/lawrence-witt/StrangeArray" target="_blank" rel="noopener noreferrer"><Github className="h-button"/></a>
                <a href="https://itt.dev" target="_blank" rel="noopener noreferrer"><IttLogo className="h-button"/></a>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view,
    userUpload: state.view.userUpload
});

export default connect(mapStateToProps, { startTransition, setCustomUserArray })(Home);