import './style.scss';
import 'bootstrap';
import { getDataFromLocalStorage } from './modules/dataManagement';
import {
  setupDisplay,
  switchPage,
  closeGlobalMenu,
  setCategoryInputs,
  setAddNew,
  setQuizList,
} from './modules/display';
import type { Inputs } from './types/inputs.type';
import type { InputsCategory } from './types/inputsCategory.type';
import type { modalForDeleteElmsType } from './types/modalForDeleteElms.type';

document.body.classList.add('loaded');

const quizCategory = getDataFromLocalStorage('quizCategory');
const quizData = getDataFromLocalStorage('quizData');

const globalNavElm = document.querySelector<HTMLElement>('.js-globalNav');
const globalNavLiElms = globalNavElm?.querySelectorAll<HTMLLIElement>('li');

setupDisplay(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  false
);

const buttonCancelElm =
  document.querySelector<HTMLButtonElement>('.js-buttonCancel');

globalNavLiElms?.forEach((elm) => {
  elm.addEventListener('click', function (e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const listIndex = Number(target.dataset.index);
    const isModalNeeded: boolean = !buttonCancelElm?.disabled;
    switchPage(listIndex, isModalNeeded);
  });
});

if (globalNavElm) {
  closeGlobalMenu(globalNavElm);
}

const modalForDeleteDivElm = document.querySelector('.js-modalForDeleteDiv');
const modalTextDivElm = modalForDeleteDivElm?.querySelector('.js-textDiv');
const modalTitleH1Elm = modalForDeleteDivElm?.querySelector('.js-titleH1');
const deleteButtonElm = modalForDeleteDivElm?.querySelector('.js-deleteButton');

const modalForDeleteElms: modalForDeleteElmsType = {
  containerDiv: modalForDeleteDivElm as HTMLElement,
  textDiv: modalTextDivElm as HTMLElement,
  titleH1: modalTitleH1Elm as HTMLElement,
  deleteButton: deleteButtonElm as HTMLButtonElement,
};

setQuizList(
  quizData as Map<number, Inputs>,
  quizCategory as Map<number, InputsCategory>,
  modalForDeleteElms as modalForDeleteElmsType,
  buttonCancelElm as HTMLButtonElement
);

setCategoryInputs(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  modalForDeleteElms,
  buttonCancelElm as HTMLButtonElement
);

setAddNew(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  modalForDeleteElms,
  buttonCancelElm as HTMLButtonElement
);
