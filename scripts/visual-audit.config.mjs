export const DESIGN_SYSTEM = {
  name: 'Nebula Core',
  projectId: 'projects/3048263380749146026',
  assetId: 'assets/d021a85676194ad2a13c6d9615716ded',
};

export const STITCH_REFERENCES = {
  homeConsole: {
    screenId:
      'projects/3048263380749146026/screens/65b985b82da64bfd9fd91e9ce883ee68',
    title: 'G.Faundez // ML-Ops Console v2.1',
  },
  homeStreamlined: {
    screenId:
      'projects/3048263380749146026/screens/62b59d36003d4018a375b366059e41ae',
    title: 'G.Faundez // ML-Ops Console (Streamlined)',
  },
  buttonSpec: {
    screenId:
      'projects/3048263380749146026/screens/1e39f786974845618ade077b72e2a3da',
    title: 'Interaction & Button Specification',
  },
  pretextLab: {
    screenId:
      'projects/3048263380749146026/screens/c6ff99a72e4f4209a7ee550c6353f45e',
    title: 'Pretext Lab: 24th-Century Ops Deck',
  },
};

export const VIEWPORTS = {
  desktop: {
    width: 1440,
    height: 1080,
  },
  tablet: {
    width: 1024,
    height: 1366,
  },
  mobile: {
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  },
};

export const SOURCES = {
  local: {
    id: 'local',
    baseUrl: 'http://127.0.0.1:4201',
    label: 'Local application',
  },
  'production-reference': {
    id: 'production-reference',
    baseUrl: 'https://fardust.web.app',
    label: 'Production reference',
  },
};

const SHARED_COMPONENTS = {
  navbar: {
    id: 'navbar',
    label: 'Navbar',
    selectors: {
      local: 'app-navbar .console-navbar',
      'production-reference': 'nav:not([aria-label="Landing navigation"])',
    },
    designReferences: [STITCH_REFERENCES.homeConsole],
  },
  footer: {
    id: 'footer',
    label: 'Footer',
    selectors: {
      local: 'app-footer .console-footer',
      'production-reference': 'footer',
    },
    designReferences: [STITCH_REFERENCES.homeConsole],
  },
  rail: {
    id: 'rail',
    label: 'Route rail',
    hiddenOnViewports: ['mobile'],
    selectors: {
      local: 'nav[aria-label="Landing navigation"]',
      'production-reference': 'nav[aria-label="Landing navigation"]',
    },
    designReferences: [STITCH_REFERENCES.homeConsole],
  },
};

export const ROUTES = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    sources: ['local', 'production-reference'],
    readySelectors: {
      local: 'app-console-hero-panel .console-hero',
      'production-reference': 'app-console-hero-panel .console-hero',
    },
    designReferences: [
      STITCH_REFERENCES.homeConsole,
      STITCH_REFERENCES.homeStreamlined,
      STITCH_REFERENCES.buttonSpec,
    ],
    components: [
      SHARED_COMPONENTS.navbar,
      {
        id: 'left-rail',
        label: 'Left rail',
        hiddenOnViewports: ['mobile'],
        selectors: {
          local: 'app-console-left-rail .console-rail',
          'production-reference': 'app-console-left-rail .console-rail',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'hero-panel',
        label: 'Hero panel',
        selectors: {
          local: 'app-console-hero-panel .console-hero',
          'production-reference': 'app-console-hero-panel .console-hero',
        },
        designReferences: [
          STITCH_REFERENCES.homeConsole,
          STITCH_REFERENCES.homeStreamlined,
        ],
      },
      {
        id: 'hero-actions',
        label: 'Hero CTA row',
        selectors: {
          local: 'app-console-hero-panel .console-hero__actions',
          'production-reference':
            'app-console-hero-panel .console-hero__actions',
        },
        designReferences: [STITCH_REFERENCES.buttonSpec],
      },
      {
        id: 'pipeline-panel',
        label: 'Pipeline panel',
        selectors: {
          local: 'app-console-pipeline-panel .console-pipelines',
          'production-reference':
            'app-console-pipeline-panel .console-pipelines',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'project-registry',
        label: 'Project registry',
        selectors: {
          local: 'app-console-project-registry .console-registry',
          'production-reference':
            'app-console-project-registry .console-registry',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'sidebar-panel',
        label: 'Sidebar panel',
        selectors: {
          local: 'app-console-sidebar-panel .console-sidebar',
          'production-reference': 'app-console-sidebar-panel .console-sidebar',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      SHARED_COMPONENTS.footer,
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    path: '/experience',
    sources: ['local', 'production-reference'],
    readySelectors: {
      local: '.experience-viewer__header',
      'production-reference': '.experience-viewer__header',
    },
    designReferences: [
      STITCH_REFERENCES.homeConsole,
      STITCH_REFERENCES.buttonSpec,
    ],
    components: [
      SHARED_COMPONENTS.navbar,
      SHARED_COMPONENTS.rail,
      {
        id: 'viewer-header',
        label: 'Viewer header',
        selectors: {
          local: '.experience-viewer__header',
          'production-reference': '.experience-viewer__header',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'viewer-actions',
        label: 'Action row',
        selectors: {
          local: '.experience-viewer__actions',
          'production-reference': '.experience-viewer__actions',
        },
        designReferences: [STITCH_REFERENCES.buttonSpec],
      },
      {
        id: 'viewer-toolbar',
        label: 'Toolbar',
        selectors: {
          local: '.experience-viewer__toolbar',
          'production-reference': '.experience-viewer__toolbar',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'viewer-frame',
        label: 'PDF frame',
        selectors: {
          local: '.experience-viewer__frame',
          'production-reference': '.experience-viewer__frame',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'experience-meta',
        label: 'Experience meta',
        selectors: {
          local: '.experience-meta',
          'production-reference': '.experience-meta',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      SHARED_COMPONENTS.footer,
    ],
  },
  {
    id: 'pretext',
    label: 'Pretext',
    path: '/pretext',
    sources: ['local'],
    readySelectors: {
      local: 'app-pretext-hero.pretext-hero',
    },
    designReferences: [
      STITCH_REFERENCES.pretextLab,
      STITCH_REFERENCES.buttonSpec,
    ],
    components: [
      SHARED_COMPONENTS.navbar,
      {
        id: 'route-hero',
        label: 'Pretext hero',
        selectors: {
          local: 'app-pretext-hero.pretext-hero',
        },
        designReferences: [STITCH_REFERENCES.pretextLab],
      },
      {
        id: 'editorial-engine',
        label: 'Editorial engine',
        selectors: {
          local: 'app-pretext-editorial-engine .pretext-editorial',
        },
        designReferences: [STITCH_REFERENCES.pretextLab],
      },
      {
        id: 'shrinkwrap-showdown',
        label: 'Shrinkwrap showdown',
        selectors: {
          local: 'app-pretext-shrinkwrap-showdown .pretext-shrinkwrap',
        },
        designReferences: [STITCH_REFERENCES.pretextLab],
      },
      {
        id: 'validation-section',
        label: 'Validation section',
        selectors: {
          local: 'app-pretext-validation-section',
        },
        designReferences: [STITCH_REFERENCES.pretextLab],
      },
      SHARED_COMPONENTS.footer,
    ],
  },
  {
    id: 'ball',
    label: 'Ball',
    path: '/ball',
    sources: ['local', 'production-reference'],
    readySelectors: {
      local: '.ball-container',
      'production-reference': '.ball-container',
    },
    designReferences: [STITCH_REFERENCES.homeConsole],
    components: [
      SHARED_COMPONENTS.navbar,
      {
        id: 'ball-shell',
        label: 'Ball shell',
        selectors: {
          local: '.ball-container',
          'production-reference': '.ball-container',
        },
        designReferences: [STITCH_REFERENCES.homeConsole],
      },
      {
        id: 'ball-fallback',
        label: 'Fallback card',
        selectors: {
          local: '.ball-fallback',
          'production-reference': '.ball-fallback',
        },
        designReferences: [STITCH_REFERENCES.buttonSpec],
      },
      SHARED_COMPONENTS.footer,
    ],
  },
  {
    id: 'not-found',
    label: '404',
    path: '/definitely-missing-route',
    sources: ['local'],
    readySelectors: {
      local: '.page-not-found',
    },
    components: [
      SHARED_COMPONENTS.navbar,
      {
        id: 'error-panel',
        label: 'Error panel',
        selectors: {
          local: '.page-not-found',
        },
      },
      SHARED_COMPONENTS.footer,
    ],
  },
];
