import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PretextTextComponent } from 'src/app/pretext/pretext-text.component';

@Component({
  selector: 'app-console-profile-badge',
  imports: [PretextTextComponent],
  templateUrl: './console-profile-badge.component.html',
  styleUrls: ['./console-profile-badge.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'console-profile-badge',
    '[class.console-profile-badge--compact]': 'size() === "compact"',
  },
})
export class ConsoleProfileBadgeComponent {
  imageSrc = input<string | null>(null);
  imageAlt = input.required<string>();
  fallbackLabel = input('GF');
  size = input<'hero' | 'compact'>('hero');
  showStatus = input(true);
}
