import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { DetailsPage } from '../../pages/details/details';

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
    private afAuth: AngularFireAuth) {
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
      })
  }

  gotoDetails() {
    this.navCtrl.push(DetailsPage);
  }

  signInGoogle() {
    console.log("clicked");
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((res) => {
      // this.userName = res.additionalUserInfo.profile.given_name;
      // console.log(res);
    });
  }

  signOut() {
    console.log("logout");
    this.afAuth.auth.signOut();
  }

}
