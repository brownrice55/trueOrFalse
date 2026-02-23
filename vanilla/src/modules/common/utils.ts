import type { Inputs } from '../../types/inputs.type';
export function getAccuracyRate(aVal: Inputs) {
  return aVal.numberOfAnswers && aVal.numberOfCorrectAnswers
    ? (aVal.numberOfCorrectAnswers / aVal.numberOfAnswers) * 100
    : '0';
}
