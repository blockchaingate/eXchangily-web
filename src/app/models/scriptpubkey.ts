export interface ScriptPubKey {
    addresses?: string[];
    asm: string;
    hex: string;
    reqSigs?: number;
    type: string;
}
