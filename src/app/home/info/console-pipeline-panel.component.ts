import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsolePipelineStage } from './console.models';
import { PretextTextComponent } from 'src/app/pretext/pretext-text.component';

@Component({
  selector: 'app-console-pipeline-panel',
  imports: [CommonModule, PretextTextComponent],
  templateUrl: './console-pipeline-panel.component.html',
  styleUrls: ['./console-pipeline-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolePipelinePanelComponent {
  stages = input.required<ReadonlyArray<ConsolePipelineStage>>();

  stageToneClass(stage: ConsolePipelineStage): string {
    switch (stage.tone) {
      case 'success':
        return 'console-pipelines__state--success';
      case 'primary':
        return 'console-pipelines__state--primary';
      default:
        return 'console-pipelines__state--muted';
    }
  }
}
