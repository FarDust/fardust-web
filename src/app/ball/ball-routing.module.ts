import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallComponent } from './ball.component';

const routes: Routes = [
  { path: '', component: BallComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BallRoutingModule { }
