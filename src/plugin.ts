import type { PiniaPluginContext, StateTree, Store, SubscriptionCallbackMutation } from 'pinia';
import type { TPersist, IOptions, IExtendPersist } from './types';
import { isPlainObject, isBoolean, pick, error, isArray, isUndefined } from './utils';
import sunshineStorage from 'sunshine-storage';

const validate = (persist: TPersist) => {
  if (isPlainObject(persist) || isBoolean(persist) || isUndefined(persist)) {
    return Boolean(persist);
  }

  error('persist error');

  return false;
};

const persistState = (state: StateTree, persist: IExtendPersist) => {
  const { storage, key, paths, debug } = persist;

  try {
    const data = isArray(paths) ? pick(state, paths) : state;
    // indexedDB 只能存储一个引用 0 的对象，所以需要深拷贝
    storage!.setItem(key!, JSON.parse(JSON.stringify(data)));
  } catch (e) {
    if (debug) {
      error(e as string);
    }
  }
};

const hydrateStore = async (store: Store, persist: IExtendPersist) => {
  const { storage, key, debug } = persist;
  try {
    const data = await storage!.getItem(key!);
    if (data) {
      store.$patch(data);
    }
  } catch (e) {
    if (debug) {
      error(e as string);
    }
  }
};

const init = (context: PiniaPluginContext, persist: TPersist, options: IOptions) => {
  const { store } = context;
  const { prefix = '', suffix = '' } = options;
  const _persist: IExtendPersist = isBoolean(persist)
    ? {
        storage: sunshineStorage.createInstance({
          storage: localStorage,
          foceStorage: true,
        }),
        key: `${prefix}${store.$id}${suffix}`,
        paths: undefined,
        debug: false,
        beforeRestore: undefined,
        afterRestore: undefined,
      }
    : {
        storage: sunshineStorage.createInstance({
          storage: persist.storage ?? localStorage,
          foceStorage: !persist.type || persist.type === 'storage',
          name: 'pinia_db',
        }),
        key: `${prefix}${persist.key ?? store.$id}${suffix}`,
        paths: persist.paths ?? undefined,
        debug: persist.debug ?? false,
        beforeRestore: persist.beforeRestore ?? undefined,
        afterRestore: persist.afterRestore ?? undefined,
      };

  const { beforeRestore, afterRestore } = _persist;

  store.$persist = () => {
    persistState(store.$state, _persist);
  };

  store.$hydrate = () => {
    beforeRestore?.(context);

    hydrateStore(store, _persist);

    afterRestore?.(context);
  };

  store.$hydrate();

  store.$subscribe(
    (_mutation: SubscriptionCallbackMutation<StateTree>, state: StateTree) => {
      persistState(state, _persist);
    },
    {
      detached: true,
    },
  );
};

export const plugin = (context: PiniaPluginContext, _options: IOptions = {}) => {
  const { options } = context;

  const { persist } = options as unknown as { persist: TPersist };

  if (!validate(persist)) return;

  init(context, persist, _options);
};

export const createPlugin = (options: IOptions) => {
  return (context: PiniaPluginContext) => plugin(context, options);
};

export default plugin;
