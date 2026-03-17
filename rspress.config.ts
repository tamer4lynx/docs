import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Tamer4Lynx',
  description: 'Lynx ecosystem of native extensions and tooling',
  icon: '/tamer-logo.png',
  logo: {
    light: '/tamer-logo.png',
    dark: '/tamer-logo.png',
  },
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/docs/' },
      { text: 'Configuration', link: '/docs/configuration' },
      { text: 'Commands', link: '/commands' },
      { text: 'Packages', link: '/packages/' },
    ],
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
