import './style.scss';
import { getDataFromLocalStorage } from './modules/dataManagement';
import { setupInitialDisplay, switchPage } from './modules/display';
import type { Inputs } from './types/inputs.type';

document.body.classList.add('loaded');

const quizCategory = getDataFromLocalStorage('quizCategory');
const quizData = getDataFromLocalStorage('quizData');

const globalNavLiElms =
  document.querySelectorAll<HTMLLIElement>('.js-globalNav li');

setupInitialDisplay(quizCategory as string[], quizData as Map<number, Inputs>);

globalNavLiElms.forEach((elm) => {
  elm.addEventListener('click', function (e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const listIndex = Number(target.dataset.index);
    switchPage(listIndex);
  });
});
