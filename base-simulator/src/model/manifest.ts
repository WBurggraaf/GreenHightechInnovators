import { InputPipeline } from "./child";
import { Children } from "./children";
import { Plugins } from "./plugins";
import { PluginBase } from "./plugins/pluginsBase";

export class Manifest {
    name: string = '';
    description: string = '';
    tags: any = null;
    initialize: Plugins = new Plugins;
    tree: Children = new Children;

    public addPipeline(pipeline: InputPipeline) {
        this.tree.addChild(pipeline);
    }

    public addPlugin(x: PluginBase) {
        this.initialize.addPlugin(x);
    }
}
