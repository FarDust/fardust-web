import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { CountryService } from '../../services/country.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ConsoleComponent],
  exports: [ConsoleComponent],
  imports: [CommonModule, FontAwesomeModule],
  providers: [CountryService],
})
export class ConsoleModule {}
