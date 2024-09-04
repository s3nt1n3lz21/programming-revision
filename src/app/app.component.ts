import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { emptyQuestion, Question } from './model/IQuestion';
import { ApiService } from './services/api.service';
import { SetQuestions } from './store/action';
import { AppStateWrapper } from './store/reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Component State
  title = 'programming-revision';

  // App State
  questions: Question[] = [];

  constructor(
    private store: Store<AppStateWrapper>,
    private apiService: ApiService
  ) {
    // Load the firebase service account details from a local non-git file, without using a backend
    // var {google} = require("googleapis");

    // // Load the service account key JSON file.
    // var serviceAccount = require("../../firebase-service-account.json");
    // // console.log('serviceAccountDetails: ', serviceAccount);

    // // Define the required scopes.
    // var scopes = [
    //   "https://www.googleapis.com/auth/userinfo.email",
    //   "https://www.googleapis.com/auth/firebase.database"
    // ];
    
    // // Authenticate a JWT client with the service account.
    // var jwtClient = new google.auth.JWT(
    //   serviceAccount.client_email,
    //   null,
    //   serviceAccount.private_key,
    //   scopes
    // );
    
    // // Use the JWT client to generate an access token.
    // jwtClient.authorize(function(error, tokens) {
    //   if (error) {
    //     console.log("Error making request to generate access token:", error);
    //   } else if (tokens.access_token === null) {
    //     console.log("Provided service account does not have permission to generate access tokens");
    //   } else {
    //     this.apiService.token = tokens.access_token;
    //     // See the "Using the access token" section below for information
    //     // on how to use the access token to send authenticated requests to
    //     // the Realtime Database REST API.
    //   }
    // });
    


    // var admin = require("firebase-admin");
    // var serviceAccount = require("path/to/serviceAccountKey.json");
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   databaseURL: "https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app"
    // });
  }

  ngOnInit() {
    this.apiService.getQuestions().subscribe(
      (data) => {
        const questions: Question[] = [];
        for (const key in data) {
          const question: Question = {
            ...emptyQuestion(),
            id: key,
            ...data[key],
          };

          if (!question.tags || !Array.isArray(question.tags)) {
            question.tags = []
          }

          questions.push(question);
        }
  
        this.questions = questions;
        this.store.dispatch(new SetQuestions(questions));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  // public saveToCSVFile(fileName: string, data: string[][]) {
  //   // const rows = [
  //   //   ["name1", "city1", "some other info"],
  //   //   ["name2", "city2", "more info"]
  //   // ];
    
  //   let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    
  //   var encodedUri = encodeURI(csvContent);
  //   var link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", fileName + ".csv");
  //   document.body.appendChild(link); // Required for FireFox
  //   link.click(); // This will download the data file named "my_data.csv".

  //   console.log('file downloaded');
  // }

  // public previewFile(files: FileList) {
  //   console.log(files);
  //   if (files && files.length > 0) {
  //     let file: File = files.item(0);
  //     console.log(file.name);
  //     console.log(file.size);
  //     console.log(file.type);
  //     //File reader method
  //     let reader: FileReader = new FileReader();
  //     reader.readAsText(file);
  //     reader.onload = (e) => {
  //       // Get all the text
  //       let csv: any = reader.result;
  //       let allTextLines = [];
  //       allTextLines = csv.split(/\r|\n|\r/);

  //       console.log('alltext: ', allTextLines);

  //       //Table Headings
  //       let headers = allTextLines[0].split(',');
  //       let data = headers;
  //       let tarr = [];
  //       for (let j = 0; j < headers.length; j++) {
  //         tarr.push(data[j]);
  //       }

  //       // Table questions
  //       let arrl = allTextLines.length;
  //       let questions: string[] = [];
  //       for (let i = 1; i < arrl; i++) {
  //         const row = allTextLines[i];
  //         if (row) {
  //           questions.push(row.split(','));
  //         }
  //       }

  //       this.questions = questions.map((q) => 
  //         {
  //           const question = emptyQuestion();
  //           question.question = q[0],
  //           question.answer = q[1]
  //           // question.datesAnswered = q[2].split(';')
  //           return question;
  //         } 
  //       );

  //       // this.nextQuestion();
  //       console.log('questions: ', this.questions);
  //     }
  //   }
  // }

  // public saveData() {
  //   const questionsArray = this.questions.map((q) => {
  //     const dates: string = q.datesAnswered.join(';');
  //     return [q.question, q.answer, dates];
  //   })

  //   this.saveToCSVFile('programmingRevision', questionsArray);
  // }

  //https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
}
