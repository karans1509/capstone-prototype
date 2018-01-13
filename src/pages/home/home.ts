import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { DetailsPage } from '../../pages/details/details';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';
import { TakePhotoPage } from '../take-photo/take-photo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items : Observable<any[]>;
  userName: String;
  photoUrl: String;
  // appUser: firebase.User;

  constructor(
    public navCtrl: NavController, 
    public db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    private googlePlus: GooglePlus, 
    private platform: Platform) {

      this.items = db.list('students').valueChanges();
      console.log(this.items);

      afAuth.authState.subscribe((user) => {
        // this.appUser = user;
        console.log(user);
        if(!user) {
           this.userName = null;
           this.photoUrl = null;
           return;    
        }
        this.userName = user.displayName;
        this.photoUrl = user.photoURL;
        // console.log(user.photoURL);
      })
  }

  gotoDetails() {
    this.navCtrl.push(DetailsPage);
  }

  gotoCamera() {
    this.navCtrl.push(TakePhotoPage);
  }

  signInGoogle() {
    console.log("clicked");
    if(this.platform.is('cordova')) {
      this.googlePlus.login({ 
        'webClientId' : '835207808485-3ag6oegh35h528d4b7nco2op89b6k0uj.apps.googleusercontent.com'
       }).then((res) => {
         const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
         firebase.auth().signInWithCredential(googleCredential)
         .then((response) => {
           console.log("Firebase Success : "+JSON.stringify(response));
         });
      }).catch((err) => {
        console.log(err);
      })
    }
    else {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((res) => {
      // this.userName = res.additionalUserInfo.profile.given_name;
      // console.log(res);
    });
    }
  }

  signOut() {
    console.log("logout");
    this.afAuth.auth.signOut();
  }

}
