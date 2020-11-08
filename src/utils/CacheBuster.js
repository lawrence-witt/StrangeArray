import React from 'react';
import packageJson from '../../package.json';
global.appVersion = packageJson.version;

const semverGreaterThan = (versionA, versionB) => {
    const versionsA = versionA.split(/\./g);
    const versionsB = versionB.split(/\./g);
    
    while (versionsA.length || versionsB.length) {
        const a = Number(versionsA.shift());
    
        const b = Number(versionsB.shift());
        // eslint-disable-next-line no-continue
        if (a === b) continue;
        // eslint-disable-next-line no-restricted-globals
        return a > b || isNaN(b);
    };

    return false;
}

export default class CacheBuster extends React.Component {
    state = {
        hasError: false,
        errorMsg: ''
    };

    componentDidCatch() {
        this.setState({hasError: true});
    };

    componentDidMount() {
        fetch('/meta.json')
        .then((response) => response.json())
        .then((meta) => {
            const latestVersion = meta.version;
            const currentVersion = global.appVersion;

            const shouldForceRefresh = semverGreaterThan(latestVersion, currentVersion);
            if (shouldForceRefresh) {
                console.log(`New version found - ${latestVersion}. Refreshing cache.`);
                this.setState({errorMsg: 'Reloading from server...'});
                setTimeout(() => {
                    this.refreshCacheAndReload();
                }, 500);
            } else {
                console.log(`Version ${latestVersion} is up to date. No cache refresh needed.`);
            }
        });
    };

    refreshCacheAndReload = () => {
        console.log('Clearing cache and reloading.');

        if (caches) {
            caches.keys().then(function(names) {
                for (let name of names) caches.delete(name);
            });
        };
        
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <h3>Sorry, something went wrong!</h3>
                    <h3>{this.state.errorMsg}</h3>
                </div>
            );
        };

        return this.props.children;
    };
};