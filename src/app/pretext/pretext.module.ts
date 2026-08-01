import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PretextRoutingModule } from './pretext-routing.module';
import { PretextComponent } from './pretext.component';

@NgModule({
  imports: [CommonModule, PretextRoutingModule, PretextComponent],
})
export class PretextModule {}
