import {ERRORS} from '../util/errors';
import {STRINGS} from '../config';

import {PluginInterface} from '../types/interface';
import {PluginStorage} from '../types/plugin-storage';

const {PluginInitalizationError} = ERRORS;
const {NOT_INITALIZED_PLUGIN} = STRINGS;

/**
 * Storage for maintaining plugins.
 */
export const pluginStorage = () => {
  const storage: PluginStorage = {};

  return {
    /**
     * Gets plugin by given `name`. If it's missing then throws error.
     */
    get: (name: string) => {
      const plugin = storage[name];

      if (!plugin) {
        throw new PluginInitalizationError(NOT_INITALIZED_PLUGIN(name));
      }

      return plugin;
    },
    /**
     * Saves given `plugin` with given `name`.
     */
    set: function (name: string, plugin: PluginInterface) {
      storage[name] = plugin;

      return this;
    },
  };
};
