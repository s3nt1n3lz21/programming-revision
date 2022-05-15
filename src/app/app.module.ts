import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './components/question/question.component';
import { RevisionComponent } from './pages/revision/revision.component';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { AddQuestionComponent } from './pages/add-question/add-question.component';
import { HeaderComponent } from './pages/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { reducer } from './store/reducer';
import { ExpiredPipe } from './pipes/expired.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { BarComponent } from './components/charts/bar/bar.component';
import { LoginComponent } from './pages/login/login.component';
import { NotificationComponent } from './components/notification/notification.component'; 
import { NotificationService } from './services/notification.service';
import { MaterialModule } from './modules/material.module';


@NgModule({
	declarations: [
		// Layout
		AppComponent,
		HeaderComponent,

		// Pages
		LoginComponent,
		QuestionsListComponent,
		AddQuestionComponent,
		RevisionComponent,

		// Components
		QuestionComponent,
		BarComponent,
		NotificationComponent,

		// Pipes
		ExpiredPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		MaterialModule,
		StoreModule.forRoot({ state: reducer }),
		BrowserAnimationsModule
	],
	providers: [
		NotificationService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
