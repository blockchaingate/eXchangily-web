import * as buffer from 'buffer';
import * as process from 'process';

(window as any).global = window;
(window as any).Buffer = buffer.Buffer;
global.process = process;
