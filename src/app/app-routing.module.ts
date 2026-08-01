import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    title: 'G. Faundez — ML Engineer',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'experience',
    title: 'Experience — G. Faundez',
    loadChildren: () =>
      import('./experience/experience.module').then((m) => m.ExperienceModule),
  },
  {
    path: 'embedding-space',
    title: 'Embedding Space — G. Faundez',
    loadChildren: () =>
      import('./embedding-space/embedding-space.module').then(
        (m) => m.EmbeddingSpaceModule,
      ),
  },
  { path: 'ball', redirectTo: 'embedding-space', pathMatch: 'full' },
  {
    path: 'pretext',
    title: 'Pretext Lab — G. Faundez',
    loadChildren: () =>
      import('./pretext/pretext.module').then((m) => m.PretextModule),
  },
  { path: 'projects', redirectTo: 'pretext', pathMatch: 'full' },
  {
    path: '**',
    title: 'Not Found — G. Faundez',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollOffset: [0, 88],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
