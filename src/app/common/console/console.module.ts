import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { CountryService } from '../../services/country.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ConsoleComponent],
  exports: [ConsoleComponent],
  imports: [CommonModule, FontAwesomeModule],
  providers: [CountryService, provideHttpClient(withInterceptorsFromDi())],
})
export class ConsoleModule {}
