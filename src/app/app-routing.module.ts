import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddQuestionComponent } from './pages/add-question/add-question.component';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { RevisionComponent } from './pages/revision/revision.component';

const routes: Routes = [
  { path: '', redirectTo: 'revision', pathMatch: 'full' },

  {
    path: 'revision',
    component: RevisionComponent,
  },

  {
    path: 'question-list',
    component: QuestionsListComponent,
  },

  {
    path: 'add-question',
    component: AddQuestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
