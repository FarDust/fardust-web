import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmbeddingSpaceComponent } from './embedding-space.component';

const routes: Routes = [{ path: '', component: EmbeddingSpaceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmbeddingSpaceRoutingModule {}
