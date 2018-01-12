import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VisionServiceProvider } from '../../providers/vision-service/vision-service';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
/**
 * Generated class for the TakePhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-take-photo',
  templateUrl: 'take-photo.html',
})
export class TakePhotoPage {
  itemsRef: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  items: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private camera: Camera, 
    private vision: VisionServiceProvider, 
    private db: AngularFireDatabase, 
    private alert: AlertController) {
      this.items = this.db.list('items');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TakePhotoPage');
  }

  saveResults(imageData, results) {
    this.items.push({ imageData: imageData, results: results });
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.vision.getLabels(imageData).subscribe((result) => {
        this.saveResults(imageData, result.json().responses)
      }, (err) => {
        this.showAlert(err);
      });
    }, (err) => {
      this.showAlert(err);    })
  }

}
