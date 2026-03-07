// Auto-generated barrel — replaces monolithic data.ts (issue #27)
// All existing imports `from "./data"` resolve here automatically.

import { EXTRA_PRE_QUESTIONS } from "../preAssessmentExpansion";
import { EXTRA_POST_QUESTIONS } from "../postAssessmentExpansion";

export * from './types';
export * from './constants';
export * from './mock';

import { module1 } from './module1';
import { module2 } from './module2';
import { module3 } from './module3';
import { module4 } from './module4';
import { module5 } from './module5';
import { module6 } from './module6';
import { module7 } from './module7';

export const MODULES = [module1, module2, module3, module4, module5, module6, module7];

// Merge additional assessment questions into each module
MODULES.forEach((mod) => {
  const extraPre = EXTRA_PRE_QUESTIONS[mod.id];
  if (extraPre) mod.preAssessment.questions.push(...extraPre);
  const extraPost = EXTRA_POST_QUESTIONS[mod.id];
  if (extraPost) mod.postAssessment.questions.push(...extraPost);
});
