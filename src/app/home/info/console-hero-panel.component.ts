import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GithubUser } from 'src/app/services/github.service';
import { ConsoleMetric, ConsoleSpecField } from './console.models';
import { ConsoleProfileBadgeComponent } from './console-profile-badge.component';

@Component({
  selector: 'app-console-hero-panel',
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ConsoleProfileBadgeComponent,
  ],
  templateUrl: './console-hero-panel.component.html',
  styleUrls: ['./console-hero-panel.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleHeroPanelComponent {
  github = input.required<GithubUser>();
  metrics = input.required<ReadonlyArray<ConsoleMetric>>();
  specifications = input.required<ReadonlyArray<ConsoleSpecField>>();

  displayName = computed(() => this.github().name || this.github().login);
  avatarAlt = computed(() => `${this.displayName()} GitHub avatar`);
}
