import React, { useState, useEffect } from 'react';
import { a, useSpring } from 'react-spring';
import { connect } from 'react-redux';
import delay from 'delay';

import './Home.css';
import { startTransition } from '../../redux/actions/viewActions';

const Home = props => {
    const { startTransition } = props;
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
    }, [])

    const createHandler = () => {
        setActive(false);
        startTransition('edit');
    }

    const titleSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(-200%)'})
    const buttonSpring = useSpring({transform: active ? 'translateY(0%)' : 'translateY(200%)'})


    return (
        <div className="home-container">
            <a.h1 className="title" style={titleSpring}>strange[Array]</a.h1>
            <a.section className="h-buttons" style={buttonSpring}>
                <button className="h-button" onClick={createHandler}>Create</button>
                <button className="h-button">Upload</button>
                <button className="h-button">Github</button>
                <button className="h-button">itt.dev</button>
            </a.section>
        </div>
    )
}

const mapStateToProps = state => ({
    view: state.view.view
});

export default connect(mapStateToProps, { startTransition })(Home);