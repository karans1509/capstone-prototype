import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { firebaseConfig } from '../../environment';
import { API_KEY } from '../../environment';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the VisionServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VisionServiceProvider {

  constructor(public http: Http, private db: AngularFireDatabase) {
    console.log('Hello VisionServiceProvider Provider');
  }

  getLabels(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }

    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key='+API_KEY, body);
  }

  saveResults(imageData, results) {
    this.db.list('items').push({ imageData: imageData, results: results });
  }

}
