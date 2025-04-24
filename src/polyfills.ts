import * as buffer from 'buffer';
(window as any).global = window;
(window as any).Buffer = buffer.Buffer;
global.process = require('process');
