import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-console-profile-badge',
  templateUrl: './console-profile-badge.component.html',
  styleUrls: ['./console-profile-badge.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'console-profile-badge',
    '[class.console-profile-badge--compact]': 'size() === "compact"',
  },
})
export class ConsoleProfileBadgeComponent {
  imageSrc = input.required<string>();
  imageAlt = input.required<string>();
  size = input<'hero' | 'compact'>('hero');
  showStatus = input(true);
}
