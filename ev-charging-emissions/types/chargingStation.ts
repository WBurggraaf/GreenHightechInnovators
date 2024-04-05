import { PluginParams } from "../../../types";

export class ChargingStation {
    id: number = 0;
    type: number = 0;
    converterEfficiency: number = 0;
    cableEfficiency: number = 0;
    locationLat: number = 0;
    locationIng: number = 0;

    static toModel(inputData: PluginParams): ChargingStation {
        let chargingStation = new ChargingStation();

        chargingStation.id = inputData['charging-station/id'];
        chargingStation.type = inputData['charging-station/type'];
        chargingStation.converterEfficiency = inputData['charging-station/converter-efficiency'];
        chargingStation.cableEfficiency = inputData['charging-station/cable-efficency'];
        chargingStation.locationLat = inputData['charging-station/location-lat'];
        chargingStation.locationIng = inputData['charging-station/location-lng'];

        return chargingStation;
    }
}