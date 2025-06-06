import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleModule } from '../common/console/console.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { InfoComponent } from './info/info.component';
import { HomeRoutingModule } from './home-routing.module';



@NgModule({
  declarations: [
    HomeComponent,
    InfoComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    ConsoleModule,
    FontAwesomeModule,
    TranslateModule
  ]
})
export class HomeModule { }
