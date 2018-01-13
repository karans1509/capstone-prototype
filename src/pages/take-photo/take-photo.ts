import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { VisionServiceProvider } from '../../providers/vision-service/vision-service';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
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
  labels = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private camera: Camera, 
    private vision: VisionServiceProvider, 
    private db: AngularFireDatabase, 
    private alert: AlertController) {

      this.items = this.db.list('items').valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TakePhotoPage');
    this.db.list('items').valueChanges().subscribe(resp => {

      resp.forEach(item => {

        const annotations = item['results'];
        // console.log(annotations[0].labelAnnotations);
        let label: String;
        let total = [];
        annotations[0].labelAnnotations.forEach( action => {
          console.log(action.description);
          let desc = action.description;
          if((desc.match(/laptop/g) || desc.match(/electronic/) || desc.match(/computer/) || desc.match(/device/) || desc.match(/technology/) || desc.match(/gadget/)) && action.score > 0.75) {
            console.log("E-WASTE");
            label = "E-WASTE";
          }
          if(desc.match(/plastic/g) || desc.match(/bottle/) || desc.match(/glass/) || desc.match(/can/) || desc.match(/paper/) || desc.match(/book/)) {
            console.log("RE-CYCLE");
            label = "RE-CYCLE";
          }
          if(desc.match(/junk food/g) || desc.match(/juice/)) {
            console.log("GARBAGE");
            label = "GARBAGE";
          }
          if(desc.match(/textile/g) || desc.match(/wool/g) || desc.match(/linen/g) || desc.match(/cloth/g)) {
            console.log("DONATE");
            label = "DONATE";
          }

        })
        if(label == undefined) {
          this.labels.push("NOT SURE!");
        }
        else
        this.labels.push(label);
      })
    })
    // console.log(this.items);
    console.log(this.labels);
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  refreshData(refresher) {
    this.db.list('items').valueChanges().subscribe(resp => {

      resp.forEach(item => {

        const annotations = item['results'];
        // console.log(annotations[0].labelAnnotations);
        let label: String;
        let total = [];
        annotations[0].labelAnnotations.forEach( action => {
          console.log(action.description);
          let desc = action.description;
          if((desc.match(/laptop/g) || desc.match(/electronic/g) || desc.match(/computer/g) || desc.match(/device/g) || desc.match(/technology/g) || desc.match(/gadget/g)) && action.score > 0.75) {
            console.log("E-WASTE");
            label = "E-WASTE";
          }
          if(desc.match(/plastic/g) || desc.match(/bottle/g) || desc.match(/glass/g) || desc.match(/can/g) || desc.match(/paper/g) || desc.match(/book/g)) {
            console.log("RE-CYCLE");
            label = "RE-CYCLE";
          }
          if(desc.match(/junk food/g) || desc.match(/juice/g)) {
            console.log("GARBAGE");
            label = "GARBAGE";
          }
          if(desc.match(/textile/g) || desc.match(/wool/g) || desc.match(/linen/g) || desc.match(/cloth/g)) {
            console.log("DONATE");
            label = "DONATE";
          }

        })
        if(label == undefined) {
          this.labels.push("NOT SURE!");
        }
        else
        this.labels.push(label);
      })
      refresher.complete();
    })
    // console.log(this.items);
    console.log(this.labels);
    
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
        console.log(result);
        this.vision.saveResults(imageData, result.json().responses);
        // this.saveResults(imageData, result.json().responses)
      }, (err) => {
        this.showAlert(err);
      });
    }, (err) => {
      this.showAlert(err);    })
  }
}
