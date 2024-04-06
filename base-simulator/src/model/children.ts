import { InputPipeline } from "./child";


export class Children {
    children: object = {};

    public addChild(InputPipeline: InputPipeline) {
        this.children = {
            ...this.children,
            child: InputPipeline 
        }
    }
}