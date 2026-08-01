import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  ExperienceInspectorTab,
  ExperienceSignalPanelState,
} from './experience-viewer.types';

@Component({
  selector: 'app-experience-signal-panel',
  templateUrl: './experience-signal-panel.component.html',
  styleUrls: ['./experience-signal-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ExperienceSignalPanelComponent {
  readonly state = input.required<ExperienceSignalPanelState>();
  readonly tabs: ReadonlyArray<ExperienceInspectorTab> = [
    'overview',
    'search',
    'copilot',
  ];

  readonly tabChange = output<ExperienceInspectorTab>();
  readonly searchQueryChange = output<string>();
  readonly resultSelected = output<string>();
  readonly clearCacheRequested = output<void>();
  readonly warmUpRequested = output<void>();
}
