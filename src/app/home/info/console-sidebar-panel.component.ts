import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import {
  ConsoleAction,
  ConsoleLogEntry,
  ConsoleSpecField,
} from './console.models';

@Component({
  selector: 'app-console-sidebar-panel',
  imports: [CommonModule, RouterLink, PersonalInfoComponent],
  templateUrl: './console-sidebar-panel.component.html',
  styleUrls: ['./console-sidebar-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleSidebarPanelComponent {
  specifications = input.required<ReadonlyArray<ConsoleSpecField>>();
  logs = input.required<ReadonlyArray<ConsoleLogEntry>>();
  action = input.required<ConsoleAction>();

  logToneClass(tone: ConsoleLogEntry['tone']): string {
    switch (tone) {
      case 'success':
        return 'console-sidebar__log-time--success';
      case 'primary':
        return 'console-sidebar__log-time--primary';
      default:
        return 'console-sidebar__log-time--muted';
    }
  }
}
