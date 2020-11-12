const isEventSupported = eventName => `on${eventName}` in document.body;

export default isEventSupported;