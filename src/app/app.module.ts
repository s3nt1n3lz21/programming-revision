import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RevisionCardComponent } from './components/revision-card/revision-card.component';
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
import { ShowNDirective } from './directives/show-n.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { QuestionsLeftComponent } from './components/questions-left/questions-left.component';


@NgModule({ declarations: [
        // Layout
        AppComponent,
        HeaderComponent,
        // Pages
        LoginComponent,
        QuestionsListComponent,
        AddQuestionComponent,
        RevisionComponent,
        // Components
        RevisionCardComponent,
        BarComponent,
        NotificationComponent,
        // Pipes
        ExpiredPipe,
        // Directives
        ShowNDirective
    ],
    bootstrap: [AppComponent], imports: [
        // Standalone Components
        QuestionsLeftComponent,
        
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MaterialModule,
        StoreModule.forRoot({ state: reducer }),
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
        NotificationService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
