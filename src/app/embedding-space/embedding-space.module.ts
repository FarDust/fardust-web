import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmbeddingSpaceRoutingModule } from './embedding-space-routing.module';
import { EmbeddingSpaceComponent } from './embedding-space.component';
import { EmbeddingSpaceApiPanelComponent } from './embedding-space-api-panel.component';
import { EmbeddingSpaceFallbackComponent } from './embedding-space-fallback.component';
import { EmbeddingSpaceHudComponent } from './embedding-space-hud.component';
import { PretextTextComponent } from '../pretext/pretext-text.component';

@NgModule({
  declarations: [
    EmbeddingSpaceApiPanelComponent,
    EmbeddingSpaceComponent,
    EmbeddingSpaceFallbackComponent,
    EmbeddingSpaceHudComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    EmbeddingSpaceRoutingModule,
    TranslateModule,
    PretextTextComponent,
  ],
})
export class EmbeddingSpaceModule {}
