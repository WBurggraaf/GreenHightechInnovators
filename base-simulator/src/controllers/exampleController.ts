import { Get, Post, Route } from "tsoa";
import { Manifest } from "../model/manifest";
import { Vehicle } from "../model/output/vehicle";
import { InputPipeline } from "../model/child";
import { Battery } from "../model/output/battery";
import { VehicleEmbodiedCarbonPlugin } from "../model/plugins/vehicleEmbodiedCarbonPlugin";
import { PluginBase } from "../model/plugins/pluginsBase";


//The URL route that this controller belong too. The route URL can be changed in routes/index.ts
@Route("exampleController")
export default class ExampleController {

  request: any = {};

  @Post("/")
  public async getMessage(): Promise<Manifest> {
    //The body of the post message that come back as an object
    const postBody = this.request.body;

    console.log(postBody)


    const vehicleEmbodiedCarbon = new VehicleEmbodiedCarbonPlugin();

    const pipeline = this.createPipeline();
    const manifest = this.createManifest(pipeline, vehicleEmbodiedCarbon);


    return manifest;
  }

  /**
   * An example of how to create a new input pipeline. this includes 2 of the internal properties that have been mapped to an output also the name of the plugin they may want to use.
   */
  private createPipeline(): InputPipeline {

    const vehicle = new Vehicle();
    const battery = new Battery();

    const pipeline = new InputPipeline();
    pipeline.addPlugin('vehicle-embodied-carbon');
    pipeline.addInput('2024-03-26T14:28:30', vehicle, battery);

    return pipeline;
  }

  /**
   * An example of how to create an manifest file. It uses a plugin that has been file and adds them to the namifest file
   */
  private createManifest(pipline: InputPipeline, plugin: PluginBase): Manifest {
    const manifest = new Manifest();

    manifest.name = 'vehicle-embodied-carbon';
    manifest.description = "Calculates the embodied carbon emissions associated with a vehicle's production.";
    manifest.addPipeline(pipline);
    manifest.addPlugin(plugin);

    return manifest;
  }
}