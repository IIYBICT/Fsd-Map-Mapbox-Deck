import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "De Map连飞地图",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "快速开始", link: "/start" },
    ],

    sidebar: [
      {
        // text: "快速开始",
        items: [
          { text: "快速开始", link: "/start" },
          // { text: 'Runtime API Examples', link: '/api-examples' }
        ],
      },
    ],

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],
  },
});
