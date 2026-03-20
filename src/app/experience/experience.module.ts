import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { ExperienceComponent } from './experience.component';
import { ExperienceRoutingModule } from './experience-routing.module';
import { ViewerComponent } from './viewer/viewer.component';



@NgModule({
  declarations: [
    ExperienceComponent,
    ViewerComponent
  ],
  imports: [
    CommonModule,
    ExperienceRoutingModule,
    PdfViewerModule,
    TranslateModule
  ]
})
export class ExperienceModule { }
