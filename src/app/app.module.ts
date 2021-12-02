import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './components/question/question.component';
import { RevisionComponent } from './pages/revision/revision.component';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { AddQuestionComponent } from './pages/add-question/add-question.component';
import { HeaderComponent } from './pages/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    RevisionComponent,
    QuestionsListComponent,
    AddQuestionComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
