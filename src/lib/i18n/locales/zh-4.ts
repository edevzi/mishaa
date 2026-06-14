import type { DeepPartial } from '../deep-merge';
import { en } from '../en';

export const zhPart4: DeepPartial<typeof en> = {
  common: {
    skipToContent: '跳到正文',
  },
  nav: {
    accountProfile: '个人资料',
    accountSettings: '设置',
    accountLogOut: '退出登录',
    libraryEditionBadge: '书库版',
  },
  library: {
    readerEyebrow: '阅读器',
    readerSettingsModalTitle: '阅读器设置',
    readerInterfaceThemeLabel: '界面主题',
    readerThemeDark: '深色',
    readerThemeSepia: '羊皮纸色',
    readerThemeLight: '浅色',
    readerReadingDirectionLabel: '阅读方向',
    readerDirectionLtr: '从左到右',
    readerDirectionRtl: '从右到左',
    readerLayoutSectionTitle: '版式',
    readerViewClassic: '经典',
    readerViewJournal: '杂志',
    readerViewFlow: '流式',
    readerPageOverviewLabel: '页面概览',
    readerAllPagesThumbnailsCta: '全部页面（缩略图）',
    readerFullscreenSectionTitle: '全屏',
    readerModalEnterFullscreen: '进入全屏',
    readerModalExitFullscreen: '退出全屏',
  },
  catalog: {
    filterLabel: '筛选',
    sortLabel: '排序',
    allSources: '全部来源',
    sortFeatured: '精选',
    recentlyRead: '最近阅读',
    savedFirst: '已保存优先',
    titleAsc: '标题 A-Z',
    titleDesc: '标题 Z-A',
    savedOnly: '仅已保存',
    nsfwToggleOn: '成人来源标签已开启 — 点击隐藏 NSFW 书架',
    nsfwToggleOff: '成人来源标签已关闭 — 点击显示 NSFW 书架',
  },
};
