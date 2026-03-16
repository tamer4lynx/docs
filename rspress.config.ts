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
      { text: 'Guide', link: '/guide/' },
      { text: 'Packages', link: '/packages/' },
    ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/tamer4lynx/tamer4lynx',
      },
    ],
  },
});
