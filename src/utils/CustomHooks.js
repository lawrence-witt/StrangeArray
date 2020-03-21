import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSpring } from 'react-spring';

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

export function useCubeGroup(activeFieldElements, topFieldLayer, activeRoots, topRoot, path, parentOverridden) {
    const inActiveField = useMemo(() => activeFieldElements.some(el => el.join(',') === path.join(',')), [activeFieldElements]);
    const inTopField = useMemo(() => topFieldLayer.some(el => el.join(',') === path.join(',')), [topFieldLayer]);
    const inActiveRoots = useMemo(() => activeRoots.some(el => el.join(',') === path.join(',')), [activeRoots]);
    const isTopRoot = useMemo(() => topRoot.join(',') === path.join(','), [topRoot]);
    const isOverridden = parentOverridden || (inActiveField && !inTopField && !inActiveRoots);

    return [inActiveField, inTopField, inActiveRoots, isTopRoot, isOverridden];
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