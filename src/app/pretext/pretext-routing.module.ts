import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PretextComponent } from './pretext.component';

const routes: Routes = [{ path: '', component: PretextComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PretextRoutingModule {}
