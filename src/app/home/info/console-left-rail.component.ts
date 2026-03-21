import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConsoleNavItem } from './console.models';

@Component({
  selector: 'app-console-left-rail',
  imports: [CommonModule, RouterLink],
  templateUrl: './console-left-rail.component.html',
  styleUrls: ['./console-left-rail.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsoleLeftRailComponent {
  primaryItems = input.required<ReadonlyArray<ConsoleNavItem>>();
  utilityItems = input.required<ReadonlyArray<ConsoleNavItem>>();
  focus = input.required<string>();
}
