import { mergeUiChain } from '../deep-merge';
import { en } from '../en';
import { jaPart1 } from './ja-1';
import { jaPart2 } from './ja-2';
import { jaPart3 } from './ja-3';
import { jaPart4 } from './ja-4';
import { jaPart5 } from './ja-5';
import { jaPart6 } from './ja-6';
import { jaPart7 } from './ja-7';

export const ja = mergeUiChain(en, [jaPart1, jaPart2, jaPart3, jaPart4, jaPart5, jaPart6, jaPart7]);
