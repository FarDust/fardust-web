import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleModule } from '../common/console/console.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { HomeComponent } from './home.component';
import { InfoComponent } from './info/info.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent, InfoComponent, PersonalInfoComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ConsoleModule,
    FontAwesomeModule,
    TranslateModule,
    FormsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class HomeModule {}
