import React, { useRef, useState, useEffect } from 'react';
import { useSpring } from 'react-spring';

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export function useModal(opened, mountFuncs, unmountFuncs, customAnimation) {
    const [modalActive, setModalActive] = useState(false);
    const [modalEntering, setModalEntering] = useState(false);
    const prevEntering = usePrevious(modalEntering);

    useEffect(() => {
        if(opened) {
            mountFuncs.forEach(func => func());
            setModalEntering(true);
        } else {
            setModalEntering(false);
        }
    }, [opened]);

    useEffect(() => {
        if(modalEntering) setModalActive(true);
    }, [modalEntering])

    const modalSpring = useSpring(Object.assign(customAnimation, {
        transform: modalEntering ? 'translateY(0%)' : 'translateY(-100%)',
        onRest: () => {if(!modalEntering && prevEntering) {
            setModalActive(false);
            unmountFuncs.forEach(func => func());
        }}
    }));

    return [modalActive, modalSpring];
}