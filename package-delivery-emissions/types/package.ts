import { PluginParams } from "../../../types";
import { DeliveryState } from "./enums/deliveryState";

export class Package {
    deliveryLocationLat: number = 0;
    deliveryLocationLng: number = 0;
    deliveryLocationState: DeliveryState = DeliveryState.IN_TRANSIT;
    deliveryTimePerPackage: number = 0;
    embodiedcarbon: number = 0;
    id: number = 0;
    volume: number = 0;
    weight: number = 0;

    static toModel(inputParams: PluginParams): Package {
        let parcel = new Package;
        parcel.id = inputParams['package/id'];
        parcel.volume = inputParams['package/volume'];
        parcel.weight = inputParams['package/weight'];
        parcel.deliveryLocationLat = inputParams['package/delivery-location-lat'];
        parcel.deliveryLocationLng = inputParams['package/delivery-location-lng'];

        if (inputParams['package/delivery-location-state']) {
            let deliveryState: keyof typeof DeliveryState = inputParams['package/delivery-location-state'].toUpperCase();
            parcel.deliveryLocationState = DeliveryState[deliveryState];
        }

        parcel.deliveryTimePerPackage = inputParams['package/delivery-time-per-package'];

        return parcel;
    }
}