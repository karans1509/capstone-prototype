import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailsPage } from '../pages/details/details';

const firebaseConfig = {
  apiKey: "AIzaSyBYd0t1Au-WlzvktxVAA4yF13VwO7Duedk",
  authDomain: "assign-firebase.firebaseapp.com",
  databaseURL: "https://assign-firebase.firebaseio.com",
  projectId: "assign-firebase",
  storageBucket: "assign-firebase.appspot.com",
  messagingSenderId: "835207808485"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus
  ]
})
export class AppModule {}
