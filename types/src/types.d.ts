import type { PiniaPluginContext, StateTree } from 'pinia';
import sunshineStorage from 'sunshine-storage';
export interface IOptions {
    suffix?: string;
    prefix?: string;
}
export interface Serializer {
    serialize: (value: StateTree) => string;
    deserialize: (value: string) => StateTree;
}
export interface IBasePersist {
    key?: string;
    paths?: string[];
    beforeRestore?: (context: PiniaPluginContext) => void;
    afterRestore?: (context: PiniaPluginContext) => void;
    debug?: boolean;
    serializer?: Serializer;
}
export interface IPersist extends IBasePersist {
    storage?: Storage;
    type?: 'storage' | 'db';
}
export interface IExtendPersist extends IBasePersist {
    storage: ReturnType<typeof sunshineStorage.createInstance>;
}
export type TPersist = boolean | IPersist;
declare module 'pinia' {
    interface DefineStoreOptionsBase<S extends StateTree, Store> {
        persist?: TPersist;
    }
    interface PiniaCustomProperties {
        $hydrate: (opts?: {
            runHooks?: boolean;
        }) => void;
        $persist: () => void;
    }
}
