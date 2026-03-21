import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GithubUser } from 'src/app/services/github.service';
import {
  ConsoleAction,
  ConsoleMetric,
  ConsoleSpecField,
} from './console.models';
import { ConsoleProfileBadgeComponent } from './console-profile-badge.component';

@Component({
  selector: 'app-console-hero-panel',
  imports: [CommonModule, TranslateModule, ConsoleProfileBadgeComponent],
  templateUrl: './console-hero-panel.component.html',
  styleUrls: ['./console-hero-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleHeroPanelComponent {
  github = input<GithubUser | null>(null);
  metrics = input.required<ReadonlyArray<ConsoleMetric>>();
  specifications = input.required<ReadonlyArray<ConsoleSpecField>>();
  primaryAction = input.required<ConsoleAction>();

  displayName = computed(
    () => this.github()?.name || this.github()?.login || 'Gabriel Faundez',
  );
  displayInitials = computed(() =>
    this.displayName()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((chunk) => chunk[0]?.toUpperCase() ?? '')
      .join(''),
  );
  avatarAlt = computed(() => `${this.displayName()} GitHub avatar`);
  avatarSrc = computed(() => this.github()?.avatar_url || null);
  githubUrl = computed(
    () => this.github()?.html_url || 'https://github.com/FarDust',
  );
  primaryActionHref = computed(
    () =>
      this.primaryAction().href ||
      'https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf',
  );
}
