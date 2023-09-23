import type { IPersist } from './types';
import pck from '../package.json';
import type { StateTree } from 'pinia';

export const isPlainObject = (v: unknown): v is IPersist =>
  Object.prototype.toString.call(v) === '[object Object]';

export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

export const isArray = (v: unknown): v is string[] => Array.isArray(v);
export const isUndefined = (v: unknown): v is undefined => typeof v === 'undefined';

export const throwError = (msg: string) => {
  throw new Error(`[${pck.name} ${pck.version}] ${msg}`);
};

export const warning = (msg: string) => {
  console.warn(`[${pck.name} ${pck.version}] ${msg}`);
};

export const error = (msg: string) => {
  console.error(`[${pck.name} ${pck.version}] ${msg}`);
};

export const get = (state: StateTree, path: Array<string>): unknown => {
  return path.reduce((obj, p) => {
    return obj?.[p];
  }, state);
};

export const set = (state: StateTree, path: Array<string>, val: unknown): StateTree => {
  return (
    (path.slice(0, -1).reduce((obj, p) => {
      if (/^(__proto__)$/.test(p)) return {};
      else return (obj[p] = obj[p] || {});
    }, state)[path[path.length - 1]] = val),
    state
  );
};

export const pick = (baseState: StateTree, paths: string[]): StateTree => {
  return paths.reduce<StateTree>((substate, path) => {
    const pathArray = path.split('.');
    return set(substate, pathArray, get(baseState, pathArray));
  }, {});
};
