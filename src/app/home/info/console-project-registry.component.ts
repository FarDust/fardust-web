import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsoleRegistryCard, ConsoleSupportModule } from './console.models';
import { PretextTextComponent } from 'src/app/pretext/pretext-text.component';

@Component({
  selector: 'app-console-project-registry',
  imports: [CommonModule, RouterLink, PretextTextComponent],
  templateUrl: './console-project-registry.component.html',
  styleUrls: ['./console-project-registry.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleProjectRegistryComponent {
  cards = input.required<ReadonlyArray<ConsoleRegistryCard>>();
  modules = input.required<ReadonlyArray<ConsoleSupportModule>>();
}
