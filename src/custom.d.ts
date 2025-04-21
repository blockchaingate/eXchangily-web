declare module 'eth-lib/lib/account' {
  export function sign(message: string, privateKey: string): string;
  export function decodeSignature(signature: string): [string, string, string];
}

declare module 'eth-lib/lib/hash' {
  const Hash: {
    keccak256: (input: string) => string;
    keccak256s: (input: string) => string;
    sha256: (input: string) => string;
    sha256s: (input: string) => string;
  };
  export = Hash;
}

declare module 'eth-ecies' {
  const ecies: any;
  export = ecies;
}

declare module 'bitcore-message' {
  const content: any;
  export = content;
}

declare module 'angular7-csv';

declare module './app/lib/exaddr' {
  export function toKbpayAddress(address: string): string;
  export function toLegacyAddress(address: string): string;
}