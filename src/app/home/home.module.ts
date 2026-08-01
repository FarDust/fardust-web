import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { HomeComponent } from './home.component';
import { InfoComponent } from './info/info.component';
import { HomeRoutingModule } from './home-routing.module';
import { ConsoleHeroPanelComponent } from './info/console-hero-panel.component';
import { ConsoleLeftRailComponent } from './info/console-left-rail.component';
import { ConsolePipelinePanelComponent } from './info/console-pipeline-panel.component';
import { ConsoleProjectRegistryComponent } from './info/console-project-registry.component';
import { ConsoleSidebarPanelComponent } from './info/console-sidebar-panel.component';
import { PretextTextComponent } from '../pretext/pretext-text.component';

@NgModule({
  declarations: [HomeComponent, InfoComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PersonalInfoComponent,
    ConsoleHeroPanelComponent,
    ConsoleLeftRailComponent,
    ConsolePipelinePanelComponent,
    ConsoleProjectRegistryComponent,
    ConsoleSidebarPanelComponent,
    PretextTextComponent,
  ],
})
export class HomeModule {}
