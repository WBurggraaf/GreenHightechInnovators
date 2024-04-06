import { Output } from "../../interfaces/output";

export class ChargingStation implements Output {
    cableEfficiency: number = 0;
    converterEfficiency: number = 0;
    id: number = 0;
    locationIng: number = 0;
    locationLat: number = 0;
    type: number = 0;

    toImpactFramework(): object {
        return {
            'charging-station/cable-efficency': this.cableEfficiency,
            'charging-station/converter-efficiency': this.converterEfficiency,
            'charging-station/id': this.id,
            'charging-station/location-lat': this.locationLat,
            'charging-station/location-lng': this.locationIng,
            'charging-station/type': this.type,
        }
    }
}