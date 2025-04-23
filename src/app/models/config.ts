import { Blockchain } from './blockchain';

export interface Config {
    ver: string;
    appname: string;
    appid: string;
    endpoint: string;
    endpoint2: string;
    blockchains: Blockchain[];
}
