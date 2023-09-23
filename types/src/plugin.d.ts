import type { PiniaPluginContext } from 'pinia';
import type { IOptions } from './types';
export declare const plugin: (context: PiniaPluginContext, _options?: IOptions) => void;
export declare const createPlugin: (options: IOptions) => (context: PiniaPluginContext) => void;
export default plugin;
