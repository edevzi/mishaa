import { mergeUiChain } from '../deep-merge';
import { en } from '../en';
import { koPart1 } from './ko-1';
import { koPart2 } from './ko-2';
import { koPart3 } from './ko-3';
import { koPart4 } from './ko-4';

export const ko = mergeUiChain(en, [koPart1, koPart2, koPart3, koPart4]);
