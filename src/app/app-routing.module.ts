import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalculateurFormComponent} from './components/calculateur-form/calculateur-form.component';
import {ResultatsGESComponent} from './components/resultats-ges/resultats-ges.component';

const routes: Routes = [
  { path: 'results', component: ResultatsGESComponent },
  { path: '', component: CalculateurFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
