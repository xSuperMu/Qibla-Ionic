import { Component } from '@angular/core';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public data: DeviceOrientationCompassHeading = null;
  public deviceCurrentLocation: Geoposition = null;
  private kaabaLocation: {latitude:number,longitude:number} = {latitude: 21.42276, longitude: 39.8256687};
  public qiblaLocation = 0;

  constructor(private deviceOrientation: DeviceOrientation, private geolocation: Geolocation) {

    this.deviceOrientation.watchHeading().subscribe((res: DeviceOrientationCompassHeading) => {
      this.data = res;

      if (!!this.deviceCurrentLocation) {
        const currentQibla = res.magneticHeading - this.getQiblaPosition();
        this.qiblaLocation = currentQibla > 360 ? currentQibla%360 : currentQibla;
      }
    });
    
    this.geolocation.watchPosition().subscribe((res) => {
      this.deviceCurrentLocation = res;
  });
  }

  getQiblaPosition() {
    // Convert degrees to radians
    const curLocationLat = this.convertDegreesToRadians(this.deviceCurrentLocation.coords.latitude);
    const curLocationLng = this.convertDegreesToRadians(this.deviceCurrentLocation.coords.longitude);
    const qiblaLocationLat = this.convertDegreesToRadians(this.kaabaLocation.latitude);
    const qiblaLocationLng = this.convertDegreesToRadians(this.kaabaLocation.longitude);

    // Use Basic Spherical Trigonometric Formula
    return this.convertRadiansToDegrees(
      Math.atan2(
        Math.sin(qiblaLocationLng-curLocationLng),
        (Math.cos(curLocationLat) * Math.tan(qiblaLocationLat) - Math.sin(curLocationLat) * Math.cos(qiblaLocationLng - curLocationLng))
      )
    );
  }
  convertRadiansToDegrees(radians: number) {
    return radians * 180 / Math.PI;
  }

  convertDegreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }
}