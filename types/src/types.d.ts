import type { PiniaPluginContext } from 'pinia';
import sunshineStorage from 'sunshine-storage';
export interface IOptions {
    suffix?: string;
    prefix?: string;
}
export interface IBasePersist {
    key?: string;
    paths?: string[];
    beforeRestore?: (context: PiniaPluginContext) => void;
    afterRestore?: (context: PiniaPluginContext) => void;
    debug?: boolean;
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
