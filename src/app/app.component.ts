import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { emptyQuestion, Question } from './model/IQuestion';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'programming-revision';
  questions: Question[] = [];

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.getQuestions().subscribe(
      (data) => {
        const questions = [];
        for (const key in data) {
          questions.push(data[key]);
        }
  
        this.questions = questions;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public saveToCSVFile(fileName: string, data: string[][]) {
    // const rows = [
    //   ["name1", "city1", "some other info"],
    //   ["name2", "city2", "more info"]
    // ];
    
    let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName + ".csv");
    document.body.appendChild(link); // Required for FireFox
    link.click(); // This will download the data file named "my_data.csv".

    console.log('file downloaded');
  }

  public previewFile(files: FileList) {
    console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        // Get all the text
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);

        console.log('alltext: ', allTextLines);

        //Table Headings
        let headers = allTextLines[0].split(',');
        let data = headers;
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }

        // Table questions
        let arrl = allTextLines.length;
        let questions: string[] = [];
        for (let i = 1; i < arrl; i++) {
          const row = allTextLines[i];
          if (row) {
            questions.push(row.split(','));
          }
        }

        this.questions = questions.map((q) => 
          {
            const question = emptyQuestion();
            question.question = q[0],
            question.answer = q[1]
            // question.datesAnswered = q[2].split(';')
            return question;
          } 
        );

        // this.nextQuestion();
        console.log('questions: ', this.questions);
      }
    }
  }

  // public saveData() {
  //   const questionsArray = this.questions.map((q) => {
  //     const dates: string = q.datesAnswered.join(';');
  //     return [q.question, q.answer, dates];
  //   })

  //   this.saveToCSVFile('programmingRevision', questionsArray);
  // }

  //https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
}
