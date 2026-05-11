import type { DeepPartial } from '../deep-merge';
import { en } from '../en';

export const jaPart3: DeepPartial<typeof en> = {
  faq: {
    badge: 'ライブラリ情報',
    titleLine1: 'よくある',
    titleLine2: '質問。',
    title: 'よくある質問。',
    subtitle: '要点だけ。不具合はサポートへ。',
    q1: 'ICOMICS.WIKIは本当に無料？',
    a1: 'はい。閲覧・閲読は無料です。成人向け棚は地域の法律により年齢確認が必要な場合があります。',
    q2: 'ライブラリの仕組みは？',
    a2:
      '公開カタログを束ねています：ジャンルタブやNSFW棚、ライブラリ内検索。作品ページから統合リーダーで章を開きます。',
    q3: 'スマホで読める？',
    a3: 'はい。レスポンシブHTMLです。ブラウザが許せば全画面も。',
    q4: 'アカウントは必要？',
    a4: '気軽な閲覧には不要。サインインで同期が使える場合があります。',
    q5: 'コンテンツの権利は？',
    a5: '権利はライセンサー・作者・原作配信にあります。icomics.wiki はリーダーの枠 — 問題はコンテンツポリシーへ。',
    q6: 'RSSはある？',
    a6: 'はい。/feed.xml または /feed でガイドやハブ更新を購読できます。',
    q7: 'ガイドとハブはどこ？',
    a7: 'ナビの Guides、または /reading で FAQ・RSS・ライブラリへ。',
    q8: '読書進捗はどう保存される？',
    a8:
      '未ログインはこのブラウザに保存（設定から削除可）。ログインするとアカウントへ同期できる場合があります。',
    q9: '「WIKI」とは？ iOSアプリ？Fandom？',
    a9:
      'icomics.wiki の「wiki」は当ドメインのWebマンガライブラリを指します。私用CBR向け別アプリや「Hey Kids Comics」の無関係項目とは無関係です。公式は https://icomics.wiki。',
    q10: 'Wikipedia や Fandom のwikiと同じ？',
    a10:
      'いいえ。独立サイトです。Wikipedia や Fandom コミュニティwikia ではありません。「wiki」は当サイト上のカタログとヘルプを意味します。',
    q11: '本物の ICOMICS.WIKI を見分けるには？',
    a11:
      'アドレスバーが https://icomics.wiki か確認。FAQ と /icomics-wiki で関係を説明しています。',
    q12: '国ごとにCookie・分析・言語は違う？',
    a12:
      'HTTPS の同一サイト (icomics.wiki)。UI は英・日・韓・中（簡体字）・露。初回は地域から既定を推定、它は英語。CDNヒントで同意文言や18+表現が変わる場合 — Privacy / Content Policy を参照。',
    stillQuestions: 'まだ解決しない？',
    stillDesc: 'サポートへ — 作品URLとブラウザ/OS を添えて。',
    dept: 'サポート',
    hub: 'Telegram',
    wikiExplainerCta: 'wikiの説明',
  },
  wikiLanding: {
    kicker: '検索の整理',
    titleLine1: 'ICOMICS.WIKI',
    titleLine2: 'とは？',
    lead: 'Googleから来た方向け：このドメインの正体と、違うもの。',
    p1:
      '公式サイト icomics.wiki。マンガ・マンファ・ウェブトゥーンと年齢制限/成人向け棚が中心。ヘルプもそれに沿います。',
    p2:
      'ローカルファイル向け別のiOS「iComics」アプリではありません。Fandomの無関係な「IComics Vol 1」記事とも無関係です。',
    p3:
      '「icomics wiki」でここに来たなら、Webリーダーです — Wikimediaのコピーでもストアスクショでもありません。',
    quickCheckTitle: 'すばやい確認',
    quickLi1: 'ドメインが正確に icomics.wiki（HTTPS）。',
    quickLi2: 'ナビに Library / Guides / FAQ / Reading hub。',
    quickLi3: '区別は /faq とこのページに記載。',
    ctaFaq: 'FAQ を開く',
    ctaLibrary: 'ライブラリへ',
  },
  contact: {
    badge: 'お問い合わせ',
    titleLine1: 'ご',
    titleLine2: '連絡。',
    title: 'ご連絡。',
    subtitle: 'コミュニティ向けの連絡チャネル。',
    email: 'メールサポート',
    telegram: 'Telegramチャンネル',
    domain: 'ドメイン情報',
    hq: '所在地',
    hqAddress: 'iComics.wiki Collective, タシュケント, ウズベキスタン',
    sendTitle: 'メッセージを送る',
    alias: '名前',
    frequency: 'メールアドレス',
    subject: '件名',
    payload: '本文',
    sendBtn: '送信',
    placeholderAlias: 'お名前',
    placeholderFreq: 'you@example.com',
    placeholderSub: '件名',
    placeholderMsg: 'メッセージ…',
  },
};
