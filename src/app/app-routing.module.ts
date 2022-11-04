import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalculateurFormComponent} from './components/calculateur-form/calculateur-form.component';
import { LoginComponent } from './components/login/login.component';
import {ResultatsGESComponent} from './components/resultats-ges/resultats-ges.component';

const routes: Routes = [
  { path: 'results', component: ResultatsGESComponent },
  { path: 'calculator', component: CalculateurFormComponent },
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
