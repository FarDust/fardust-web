import { ConsoleNavItem, ConsoleSpecField } from './console.models';

export const CONSOLE_CURRENT_FOCUS = 'Machine Learning Engineering';

export const CONSOLE_RAIL_UTILITY_ITEMS: ReadonlyArray<ConsoleNavItem> = [
  {
    label: 'Source',
    icon: 'code',
    href: 'https://github.com/FarDust/fardust-web',
  },
  {
    label: 'Contact',
    icon: 'mail',
    href: 'mailto:gnfaundez@uc.cl',
  },
];

export function createConsoleRailPrimaryItems(
  activeLabel:
    | 'Overview'
    | 'Selected work'
    | 'Experience'
    | 'Embedding space'
    | 'Pretext lab',
): ReadonlyArray<ConsoleNavItem> {
  return [
    {
      label: 'Overview',
      icon: 'grid_view',
      routerLink: '/',
      fragment: 'console-core',
      active: activeLabel === 'Overview',
    },
    {
      label: 'Selected work',
      icon: 'deployed_code',
      routerLink: '/',
      fragment: 'console-projects',
      active: activeLabel === 'Selected work',
    },
    {
      label: 'Experience',
      icon: 'description',
      routerLink: '/experience',
      active: activeLabel === 'Experience',
    },
    {
      label: 'Embedding space',
      icon: 'scatter_plot',
      routerLink: '/embedding-space',
      active: activeLabel === 'Embedding space',
    },
    {
      label: 'Pretext lab',
      icon: 'text_fields',
      routerLink: '/pretext',
      active: activeLabel === 'Pretext lab',
    },
  ];
}

export const CONSOLE_PROFILE_DETAILS: ReadonlyArray<ConsoleSpecField> = [
  {
    label: 'Degree',
    value: 'Computer Science',
  },
  {
    label: 'Bachelor',
    value: 'Science in Engineering',
  },
  {
    label: 'Mention',
    value: 'Software Engineering',
  },
  {
    label: 'Minor',
    value: 'Data Science',
  },
];
