import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

function pkg(cat: 'core' | 'ui' | 'platform' | 'tooling', name: string) {
  return { text: name, link: `/packages/${cat}/${name}` };
}

const lynxEcosystemGroup = {
  text: 'Lynx ecosystem',
  collapsible: true,
  collapsed: false,
  items: [
    { text: 'Lynx', link: 'https://lynxjs.org/' },
    { text: 'Rspeedy', link: 'https://lynxjs.org/rspeedy/' },
    { text: 'ReactLynx', link: 'https://lynxjs.org/react/' },
  ],
};

/** Shown on home, guide, and reference pages — no per-package list */
const guideSidebar = [
  {
    text: 'Guide',
    collapsible: true,
    collapsed: false,
    items: [
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Example Anatomy', link: '/guide/example-anatomy' },
    ],
  },
  { text: 'Commands', link: '/reference/commands' },
  { text: 'Packages', link: '/packages/' },
  lynxEcosystemGroup,
];

/** Shown only under /packages/* — category hubs + every package */
const packagesSidebar = [
  { text: 'Packages', link: '/packages/' },
  {
    text: 'Core',
    collapsible: true,
    collapsed: false,
    items: [
      pkg('core', 'tamer-dev-client'),
      pkg('core', 'tamer-host'),
      pkg('core', 'tamer-navigation'),
      pkg('core', 'tamer-router'),
      pkg('core', 'tamer-plugin'),
      pkg('core', 'tamer-app-shell'),
    ],
  },
  {
    text: 'UI',
    collapsible: true,
    collapsed: false,
    items: [
      pkg('ui', 'tamer-screen'),
      pkg('ui', 'tamer-insets'),
      pkg('ui', 'tamer-system-ui'),
      pkg('ui', 'tamer-icons'),
    ],
  },
  {
    text: 'Platform',
    collapsible: true,
    collapsed: false,
    items: [
      pkg('platform', 'tamer-transports'),
      pkg('platform', 'tamer-local-storage'),
      pkg('platform', 'jiggle'),
      pkg('platform', 'tamer-auth'),
      pkg('platform', 'tamer-secure-store'),
      pkg('platform', 'tamer-biometric'),
      pkg('platform', 'tamer-linking'),
      pkg('platform', 'tamer-display-browser'),
      pkg('platform', 'tamer-webview'),
    ],
  },
  {
    text: 'Tooling',
    collapsible: true,
    collapsed: false,
    items: [pkg('tooling', 'tamer-ambient-types'), pkg('tooling', 'tamer-env')],
  },
  lynxEcosystemGroup,
];

const sidebar: Record<string, typeof guideSidebar> = {
  '/': guideSidebar,
  '/guide/': guideSidebar,
  '/reference/': guideSidebar,
  '/packages/': packagesSidebar,
  '/packages/core/': packagesSidebar,
  '/packages/ui/': packagesSidebar,
  '/packages/platform/': packagesSidebar,
  '/packages/tooling/': packagesSidebar,
};

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  globalStyles: path.join(__dirname, 'styles', 'global.css'),
  title: 'Tamer4Lynx',
  description:
    'CLI and npm packages (@tamer4lynx/*) for Lynx: routing, native UI, platform APIs, iOS/Android hosts. HarmonyOS support coming soon.',
  icon: '/tamer-logo.png',
  logo: {
    light: '/tamer-logo.png',
    dark: '/tamer-logo.png',
  },
  llms: true,
  builderConfig: {
    server: {
      publicDir: [
        { name: path.join(__dirname, 'docs', 'public') },
        { name: path.join(__dirname, 'doc_build') },
      ],
    },
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '^/guide' },
      { text: 'Commands', link: '/reference/commands', activeMatch: '^/reference' },
      { text: 'Packages', link: '/packages/', activeMatch: '^/packages' },
    ],
    sidebar,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/tamer4lynx/tamer4lynx',
      },
    ],
    footer: {
      message:
        'If you find this helpful, consider <a href="https://ko-fi.com/nanofuxion" target="_blank" rel="noopener">supporting development</a>.',
    },
  },
});
