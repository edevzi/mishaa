import type { DeepPartial } from '../deep-merge';
import { en } from '../en';

export const koPart4: DeepPartial<typeof en> = {
  common: {
    skipToContent: '본문으로 건너뛰기',
  },
  nav: {
    accountProfile: '프로필',
    accountSettings: '설정',
    accountLogOut: '로그아웃',
    libraryEditionBadge: '라이브러리 에디션',
  },
  library: {
    readerEyebrow: '리더',
    readerSettingsModalTitle: '리더 설정',
    readerInterfaceThemeLabel: '인터페이스 테마',
    readerThemeDark: '다크',
    readerThemeSepia: '세피아',
    readerThemeLight: '라이트',
    readerReadingDirectionLabel: '읽기 방향',
    readerDirectionLtr: '왼쪽→오른쪽',
    readerDirectionRtl: '오른쪽→왼쪽',
    readerLayoutSectionTitle: '레이아웃',
    readerViewClassic: '클래식',
    readerViewJournal: '저널',
    readerViewFlow: '플로우',
    readerPageOverviewLabel: '페이지 개요',
    readerAllPagesThumbnailsCta: '전체 페이지(썸네일)',
    readerFullscreenSectionTitle: '전체 화면',
    readerModalEnterFullscreen: '전체 화면',
    readerModalExitFullscreen: '전체 화면 종료',
  },
  catalog: {
    filterLabel: '필터',
    sortLabel: '정렬',
    allSources: '모든 소스',
    sortFeatured: '추천',
    recentlyRead: '최근 읽음',
    savedFirst: '저장 우선',
    titleAsc: '제목 A-Z',
    titleDesc: '제목 Z-A',
    savedOnly: '저장만',
    nsfwToggleOn: '성인 소스 탭이 켜짐 — 클릭하면 NSFW 책장을 숨깁니다',
    nsfwToggleOff: '성인 소스 탭이 꺼짐 — 클릭하면 NSFW 책장을 표시합니다',
  },
};
