import type { DeepPartial } from '../deep-merge';
import { en } from '../en';

/** Extra UI chrome: skip link, account menu, reader modal, library catalog filters */
export const jaPart7: DeepPartial<typeof en> = {
  common: {
    skipToContent: '本文へスキップ',
  },
  nav: {
    accountProfile: 'プロフィール',
    accountSettings: '設定',
    accountLogOut: 'ログアウト',
    libraryEditionBadge: 'ライブラリ版',
  },
  library: {
    readerEyebrow: 'リーダー',
    readerSettingsModalTitle: 'リーダー設定',
    readerInterfaceThemeLabel: 'UIテーマ',
    readerThemeDark: 'ダーク',
    readerThemeSepia: 'セピア',
    readerThemeLight: 'ライト',
    readerReadingDirectionLabel: '読み方向',
    readerDirectionLtr: '左→右',
    readerDirectionRtl: '右→左',
    readerLayoutSectionTitle: 'レイアウト',
    readerViewClassic: 'クラシック',
    readerViewJournal: 'ジャーナル',
    readerViewFlow: 'フロー',
    readerPageOverviewLabel: 'ページ一覧',
    readerAllPagesThumbnailsCta: '全ページ（サムネイル）',
    readerFullscreenSectionTitle: '全画面',
    readerModalEnterFullscreen: '全画面に入る',
    readerModalExitFullscreen: '全画面を終了',
  },
  catalog: {
    filterLabel: '絞り込み',
    sortLabel: '並べ替え',
    allSources: 'すべてのソース',
    sortFeatured: 'おすすめ',
    recentlyRead: '最近読んだ',
    savedFirst: '保存優先',
    titleAsc: 'タイトル A-Z',
    titleDesc: 'タイトル Z-A',
    savedOnly: '保存のみ',
  },
};
