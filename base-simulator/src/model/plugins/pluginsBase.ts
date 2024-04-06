import { IfHelper } from "../../helpers/ifHelper";

export abstract class PluginBase {
    method: string = '';
    path: string = '';
    ['global-config']: any 

    public addToGlobalConfig(x: object) {

        this["global-config"] = {
            ...this["global-config"],
            ...x,
        }
    }
}