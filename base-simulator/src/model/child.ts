import { Output } from "../interfaces/output";


export class InputPipeline {
    pipeline: string[] = [];
    config = null;
    inputs: any[] = [];

    public addPlugin(pluginName :string) {
        this.pipeline.push(pluginName);
    }

    public addInput(timestamp:string, ...inputObjects: Output[]){
        var input = {
            'timestamp': timestamp
        };

        inputObjects.forEach(inputObject => {
            input = {
                ...input,
                ...inputObject.toImpactFramework() 
            }
        });

        this.inputs.push(input);
    }

}

