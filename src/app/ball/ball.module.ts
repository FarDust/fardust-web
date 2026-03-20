import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BallRoutingModule } from './ball-routing.module';
import { BallComponent } from './ball.component';

@NgModule({
  declarations: [BallComponent],
  imports: [CommonModule, BallRoutingModule, TranslateModule],
})
export class BallModule {}
