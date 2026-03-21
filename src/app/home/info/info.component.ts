import { Component, HostListener } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
import {
  ConsoleAction,
  ConsoleLogEntry,
  ConsoleMetric,
  ConsolePipelineStage,
  ConsoleRegistryCard,
  ConsoleSpecField,
  ConsoleSupportModule,
} from './console.models';
import {
  CONSOLE_CURRENT_FOCUS,
  CONSOLE_PROFILE_DETAILS,
  CONSOLE_RAIL_UTILITY_ITEMS,
  createConsoleRailPrimaryItems,
} from './console-shell.data';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.sass'],
  standalone: false,
})
export class InfoComponent {
  readonly currentFocus = CONSOLE_CURRENT_FOCUS;

  readonly heroMetrics: ReadonlyArray<ConsoleMetric> = [
    {
      label: 'Current focus',
      value: this.currentFocus,
      detail: 'Production ML, MLOps, and GenAI systems',
    },
    {
      label: 'Applied ML',
      value: 'ML when it fits',
      detail: 'Use it as a tool, not a trend',
    },
    {
      label: 'Languages',
      value: 'English / Spanish',
      detail: 'Advanced English, native Spanish',
    },
  ];

  readonly railPrimaryItems = createConsoleRailPrimaryItems('Overview');

  readonly railUtilityItems = CONSOLE_RAIL_UTILITY_ITEMS;

  readonly modelSpecifications: ReadonlyArray<ConsoleSpecField> =
    CONSOLE_PROFILE_DETAILS;

  readonly pipelineStages: ReadonlyArray<ConsolePipelineStage> = [
    {
      label: 'MACHINE_LEARNING',
      emphasis: 'PRIMARY',
      progress: 92,
      detail: 'MLOps, GenAI, RAG, VertexAI, TensorFlow',
      tone: 'success',
    },
    {
      label: 'SOFTWARE_ENGINEERING',
      emphasis: 'FOUNDATION',
      progress: 86,
      detail: 'Backend, web development, maintainability',
      tone: 'primary',
    },
    {
      label: 'CLOUD_AND_WEB',
      emphasis: 'DELIVERY',
      progress: 84,
      detail: 'GCP, AWS, Docker, Terraform, Angular, React',
      tone: 'primary',
    },
  ];

  readonly registryCards: ReadonlyArray<ConsoleRegistryCard> = [
    {
      eyebrow: 'Featured repository',
      title: 'Personal repository',
      description: 'Personal repository on GitHub.',
      meta: [
        { label: 'Type', value: 'Public repo' },
        { label: 'Source', value: 'Live landing' },
        { label: 'Focus', value: 'Site + experiments' },
      ],
      href: 'https://github.com/FarDust/fardust-web',
    },
    {
      eyebrow: 'Infrastructure',
      title: 'Federated GCP infrastructure',
      description: 'Federated GCP infrastructure on Terraform.',
      meta: [
        { label: 'Stack', value: 'Terraform' },
        { label: 'Cloud', value: 'GCP' },
        { label: 'Link', value: 'GitHub' },
      ],
      href: 'https://github.com/FarDust/terraform-infrastructure/tree/main',
    },
    {
      eyebrow: 'Experiment',
      title: 'Void Scanner',
      description: 'Void Scanner anomaly explorer.',
      meta: [
        { label: 'Type', value: 'Visual experiment' },
        { label: 'Stack', value: 'WebGL' },
        { label: 'Link', value: 'GitHub' },
      ],
      href: 'https://github.com/FarDust/void-scanner',
    },
  ];

  readonly supportModules: ReadonlyArray<ConsoleSupportModule> = [
    {
      title: 'Socket.io chat',
      description: 'Django realtime',
      icon: 'chat',
      href: 'https://github.com/FarDust/we-may-chat',
    },
    {
      eyebrow: 'MODULE',
      title: 'Dungeon Scape',
      description: 'Unity release',
      icon: 'stadia_controller',
      href: 'https://fardust.itch.io/dungeonscape',
    },
    {
      eyebrow: 'MODULE',
      title: 'Automatic CV deploy',
      description: 'LaTeX pipeline',
      icon: 'download',
      href: 'https://github.com/FarDust/curriculum-vitae',
    },
    {
      eyebrow: 'MODULE',
      title: 'Open Source UC',
      description: 'Legacy member',
      icon: 'groups',
      href: 'https://github.com/open-source-uc/',
    },
    {
      eyebrow: 'MODULE',
      title: 'Spell System',
      description: 'Unity tooling',
      icon: 'auto_awesome',
      href: 'https://github.com/FarDust/SpellSystem',
    },
    {
      eyebrow: 'MODULE',
      title: 'Digital assets',
      description: 'Art + mockups',
      icon: 'palette',
      href: 'https://github.com/FarDust/digital-assets',
    },
    {
      eyebrow: 'MODULE',
      title: 'WebGL Ball Demo',
      description: 'WebGL render',
      icon: 'lens_blur',
      routerLink: '/ball',
    },
  ];

  readonly systemLogs: ReadonlyArray<ConsoleLogEntry> = [
    {
      time: '[2025+]',
      message: 'Blend 360 · Machine Learning Engineer',
      tone: 'success',
    },
    {
      time: '[2025]',
      message: 'Plutto · Lead AI Engineer',
      tone: 'primary',
    },
    {
      time: '[2023-25]',
      message: 'NeuralWorks · Staff Machine Learning Engineer',
      tone: 'primary',
    },
    {
      time: '[2023]',
      message: 'NeuralWorks · Machine Learning Engineer',
      tone: 'muted',
    },
    {
      time: '[2022]',
      message: 'Betterfly · Software Engineer / Data Engineer',
      tone: 'muted',
    },
  ];

  readonly primaryAction: ConsoleAction = {
    label: 'OPEN_CV',
    href: 'https://storage.googleapis.com/landing-artifacts/curriculum/cv-gabriel-faundez.pdf',
  };

  secretSequence: string[] = ['t', 'e', 'c', 'h'];
  sequenceIndex = 0;
  easterEgg = false;

  starTrekSequence: string[] = ['n', 'c', 'c', '1', '7', '0', '1', 'd'];
  starIndex = 0;
  starTrekEgg = false;

  constructor(readonly githubService$: GithubService) {}

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === this.secretSequence[this.sequenceIndex]) {
      this.sequenceIndex++;
      if (this.sequenceIndex === this.secretSequence.length) {
        this.easterEgg = true;
        this.sequenceIndex = 0;
      }
    } else {
      this.sequenceIndex = 0;
    }

    if (key === this.starTrekSequence[this.starIndex]) {
      this.starIndex++;
      if (this.starIndex === this.starTrekSequence.length) {
        this.starTrekEgg = true;
        this.starIndex = 0;
      }
    } else {
      this.starIndex = 0;
    }
  }
}
