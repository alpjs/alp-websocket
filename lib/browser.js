'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpWebsocket;

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _nightingale = require('nightingale');

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale.ConsoleLogger('alp-websocket', _nightingale.LogLevel.INFO);
let socket;

/**
 * @function
 * @param app
*/function alpWebsocket(app) {
    start(app.config);
    app.websocket = {
        socket: socket,
        on: on,
        off: off,
        emit: emit
    };

    return socket;
}

/**
 * @function
 * @param config
*/function start(config) {
    if (socket) {
        throw new Error('WebSocket already started');
    }

    const webSocketConfig = config.get('webSocket');

    if (!webSocketConfig) {
        throw new Error('Missing config webSocket');
    }

    if (!webSocketConfig.has('port')) {
        throw new Error('Missing config webSocket.port');
    }

    const secure = webSocketConfig.get('secure');
    const port = webSocketConfig.get('port');

    socket = (0, _socket2.default)(`http${ secure ? 's' : '' }://${ location.hostname }:${ port }/`, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 1000,
        timeout: 4000,
        transports: ['websocket']
    });

    socket.on('connect', () => {
        logger.success('connected');
    });

    socket.on('disconnect', () => {
        logger.warn('disconnected');
    });

    socket.on('hello', _ref => {
        let version = _ref.version;

        if (version !== window.VERSION) {
            return location.reload(true);
        }
    });

    return socket;
}

/**
 * @function
 * @param {...*} args
*/function emit() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    logger.debug('emit', { args: args });
    return socket.emit(...args);
}

/**
 * @function
 * @param type
 * @param handler
*/function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

/**
 * @function
 * @param type
 * @param handler
*/function off(type, handler) {
    socket.off(type, handler);
}
//# sourceMappingURL=browser.js.map