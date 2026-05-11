import { mergeUiChain } from '../deep-merge';
import { en } from '../en';
import { zhPart1 } from './zh-1';
import { zhPart2 } from './zh-2';
import { zhPart3 } from './zh-3';
import { zhPart4 } from './zh-4';

export const zh = mergeUiChain(en, [zhPart1, zhPart2, zhPart3, zhPart4]);
