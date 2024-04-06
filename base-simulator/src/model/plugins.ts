import { PluginBase } from "./plugins/pluginsBase";

export class Plugins {
    plugins: object = {};

    public addPlugin(plugin: PluginBase) {
        let name = plugin.constructor.name.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
        name = name.replace('-plugin', '');

        this.plugins = {
            ...this.plugins,
            [name]: plugin
        }
    }
}