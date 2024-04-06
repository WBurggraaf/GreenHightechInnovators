export class Package {
    deliveryLocationLat: number = 0;
    deliveryLocationLng: number = 0;
    deliveryLocationState: string = '';
    deliveryTimePerPackage: number = 0;
    embodiedcarbon: number = 0;
    id: number = -1;
    volume: number = 0;
    weight: number = 0;

    toImpactFramework(): object {
        return {
          'package/delivery-location-lat': this.deliveryLocationLat,
          'package/delivery-location-lng': this.deliveryLocationLng,
          'package/delivery-location-state': this.deliveryLocationState,
          'package/delivery-time-per-package': this.deliveryTimePerPackage,
          'package/embodiedcarbon': this.embodiedcarbon,
          'package/id': this.id,
          'package/volume': this.volume,
          'package/weight': this.weight
        }
      }
}