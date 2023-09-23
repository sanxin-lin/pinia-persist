import type { IPersist } from './types';
import type { StateTree } from 'pinia';
export declare const isPlainObject: (v: unknown) => v is IPersist;
export declare const isBoolean: (v: unknown) => v is boolean;
export declare const isArray: (v: unknown) => v is string[];
export declare const isUndefined: (v: unknown) => v is undefined;
export declare const throwError: (msg: string) => never;
export declare const warning: (msg: string) => void;
export declare const error: (msg: string) => void;
export declare const get: (state: StateTree, path: Array<string>) => unknown;
export declare const set: (state: StateTree, path: Array<string>, val: unknown) => StateTree;
export declare const pick: (baseState: StateTree, paths: string[]) => StateTree;
