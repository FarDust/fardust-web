import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { ExperienceComponent } from './experience.component';
import { ExperienceRoutingModule } from './experience-routing.module';
import { ViewerComponent } from './viewer/viewer.component';
import { ExperienceHoverCardComponent } from './viewer/experience-hover-card.component';
import { ExperienceSignalPanelComponent } from './viewer/experience-signal-panel.component';
import { ConsoleLeftRailComponent } from '../home/info/console-left-rail.component';
import { PretextTextComponent } from '../pretext/pretext-text.component';

@NgModule({
  declarations: [
    ExperienceComponent,
    ViewerComponent,
    ExperienceHoverCardComponent,
    ExperienceSignalPanelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExperienceRoutingModule,
    PdfViewerModule,
    TranslateModule,
    ConsoleLeftRailComponent,
    PretextTextComponent,
  ],
})
export class ExperienceModule {}
