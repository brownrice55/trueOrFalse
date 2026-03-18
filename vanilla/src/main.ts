import './style.scss';
import * as bootstrap from 'bootstrap';
import { getDataFromLocalStorage } from './modules/dataManagement';
import {
  setupDisplay,
  switchPage,
  closeGlobalMenu,
  setCategoryInputs,
  setAddNew,
  setQuizList,
} from './modules/display';
import {
  deleteDataThroughDeleteBtnInTheModal,
  editQuizData,
} from './modules/setEvent';
import type { Inputs } from './types/inputs.type';
import type { InputsCategory } from './types/inputsCategory.type';
import type { modalForDeleteElmsType } from './types/modalForDeleteElms.type';
import type { modalForPageTransitionElmsType } from './types/modalForPageTransitionElms.type';

document.body.classList.add('loaded');

const quizCategory = getDataFromLocalStorage('quizCategory');
const quizData = getDataFromLocalStorage('quizData');

const globalNavElm = document.querySelector<HTMLElement>('.js-globalNav');
const globalNavLiElms = globalNavElm?.querySelectorAll<HTMLLIElement>('li');

const getElmsForModal = (aType: string, aContainerDivElm: HTMLElement) => {
  if (aContainerDivElm) {
    if (aType === 'delete') {
      return {
        containerDiv: aContainerDivElm as HTMLElement,
        textDiv: aContainerDivElm.querySelector('.js-textDiv') as HTMLElement,
        titleH1: aContainerDivElm.querySelector('.js-titleH1') as HTMLElement,
        deleteButton: aContainerDivElm.querySelector(
          '.js-deleteButton'
        ) as HTMLButtonElement,
      };
    } else {
      return {
        containerDiv: aContainerDivElm as HTMLElement,
        textDiv: aContainerDivElm.querySelector('.js-textDiv') as HTMLElement,
        buttonAreaDiv: aContainerDivElm.querySelector(
          '.js-pageTransitionButtonAreaDiv'
        ) as HTMLButtonElement,
      };
    }
  }
};
const modalForDeleteDivElm = document.querySelector('.js-modalForDeleteDiv');

const modalForDeleteElms = getElmsForModal(
  'delete',
  modalForDeleteDivElm as HTMLElement
);

const modalForPageTransitionDivElm = document.querySelector(
  '.js-modalForPageTransitionDiv'
);

const modalForPageTransitionElms = getElmsForModal(
  'pageTransition',
  modalForPageTransitionDivElm as HTMLElement
);

const currentValKeys: (keyof Inputs)[] = [
  'category',
  'type',
  'question',
  'answer',
  'explanation',
  'priority',
  'notes',
  'numberOfCorrectAnswers',
];

const buttonCancelElm =
  document.querySelector<HTMLButtonElement>('.js-buttonCancel');

const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;

setupDisplay(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  false,
  modalForPageTransitionElms as modalForPageTransitionElmsType,
  buttonCancelElm as HTMLButtonElement,
  sectionElms
);

globalNavLiElms?.forEach((elm) => {
  elm.addEventListener('click', function (e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const listIndex = Number(target.dataset.index);
    const isModalNeeded: boolean = !buttonCancelElm?.disabled;
    switchPage(
      listIndex,
      isModalNeeded,
      modalForPageTransitionElms as modalForPageTransitionElmsType,
      buttonCancelElm,
      sectionElms
    );
  });
});

if (globalNavElm) {
  closeGlobalMenu(globalNavElm);
}

const bsModal: bootstrap.Modal = new bootstrap.Modal(
  modalForDeleteDivElm as HTMLElement
);

setQuizList(
  quizData as Map<number, Inputs>,
  quizCategory as Map<number, InputsCategory>,
  modalForDeleteElms as modalForDeleteElmsType,
  sectionElms,
  currentValKeys,
  bsModal
);

deleteDataThroughDeleteBtnInTheModal(
  quizData as Map<number, Inputs>,
  quizCategory as Map<number, InputsCategory>,
  buttonCancelElm as HTMLButtonElement | null,
  sectionElms as NodeListOf<HTMLElement>,
  currentValKeys as (keyof Inputs)[],
  modalForDeleteElms as modalForDeleteElmsType,
  bsModal
);

setCategoryInputs(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  modalForDeleteElms as modalForDeleteElmsType,
  buttonCancelElm as HTMLButtonElement,
  sectionElms,
  currentValKeys,
  bsModal
);

setAddNew(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  modalForDeleteElms as modalForDeleteElmsType,
  buttonCancelElm as HTMLButtonElement,
  sectionElms,
  currentValKeys,
  bsModal
);

const listDlElm = document.querySelector('.js-listDl');
const listDdElms = document.querySelectorAll('.js-listDd');
const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');
editQuizData(
  quizData,
  quizCategory,
  listEditBtnElms as NodeListOf<HTMLButtonElement>,
  listDlElm as HTMLElement,
  listDdElms as NodeListOf<HTMLElement>,
  sectionElms,
  currentValKeys,
  modalForDeleteElms as modalForDeleteElmsType,
  bsModal
);
