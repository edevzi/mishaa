import type { DeepPartial } from '../deep-merge';
import { en } from '../en';

/** Japanese UI strings — part 1 (merged over `en`). */
export const jaPart1: DeepPartial<typeof en> = {
  common: { appLoading: '読み込み中…' },
  nav: {
    gallery: 'ギャラリー',
    about: '概要',
    support: 'サポート',
    guides: 'ガイド',
    readingHub: '読書ハブ',
    terminal: 'コミックスタジオ',
    registry: '登録',
    library: 'ライブラリ',
  },
  hero: {
    title: 'マンガ＆マンファ ライブラリ',
    pageH1: 'ブラウザでマンガ・マンファ・ウェブトゥーンを読む',
    featuredSeries: 'おすすめ',
    readFeaturedCta: '読む',
    desc:
      'カタログ検索、全画面で章を開く、ブックマーク—アプリ不要。MangaDex形式のマンガ、縦スクロールのウェブトゥーン、マンファ、年齢確認後は成人向け棚も。英語・日本語・韓国語・中国語（簡体字）・ロシア語のUI。',
    cta: 'ライブラリを見る',
    launch: 'すべて見る',
    issue: '号',
    standard: '公式版',
    quickSearchPlaceholder: 'タイトル検索（MangaDex）… 2文字以上',
    quickSearchResults: '一致',
    quickSearchSearching: '検索中…',
    quickSearchNone: 'まだ一致なし',
    quickSearchHint: '短時間キャッシュ — 連打でAPIを攻めません。',
    viewAllInLibrary: 'ライブラリのすべての結果',
    shelfNoMatchesTitle: '見つかりません',
    shelfNoMatchesBody: 'ホームのフィードに一致するものがありません。',
  },
  features: {
    title: 'シネマティックな読書。',
    quote: 'コマ向けに調整したタイポとコントラスト — すっきり、シャープな見開き。',
    forge: 'ライブラリアーカイブ',
    forgeDesc: 'どの章でも一貫した体験。',
    inking: 'ビジュアル品質',
    inkingDesc: '高コントラストと深い黒。',
    grid: 'スマートレイアウト',
    gridDesc: 'あらゆる端末で最適なコマ配置。',
    blueprint: 'コレクション',
    sequence: 'ストーリー',
    reliability: '純粋な品質。',
    reliabilityDesc: 'スマホもデスクトップも同じリーダー。',
    uplink: '接続',
  },
};
