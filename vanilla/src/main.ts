import './style.scss';
import * as bootstrap from 'bootstrap';
import { Collapse } from 'bootstrap';
import { getDataFromLocalStorage } from './common/dataManagement';
import { setAddNew } from './addNew/setup';
import { setQuizStart } from './quizStart/setup';
import { setQuizList } from './quizList/setup';
import { setCategorySettings } from './categorySettings/setup';
import { editQuizData } from './quizList/utils';
import { currentValKeys, switchPage } from './common/utils';
import { deleteDataThroughDeleteBtnInTheModal } from './common/modals/modal';
import type { Inputs } from './common/types/inputs.type';
import type { InputsCategory } from './common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from './common/types/modalForDeleteElms.type';
import type { modalForPageTransitionElmsType } from './common/types/modalForPageTransitionElms.type';

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

const buttonCancelElm =
  document.querySelector<HTMLButtonElement>('.js-buttonCancel');

const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;
const listDivElms = document.querySelectorAll('.js-listDiv');
const listUlElm = document.querySelector('.js-listUl');

// initial page start
const pageIndex = !quizCategory.size ? 3 : !quizData.size ? 2 : 0;
switchPage(
  pageIndex,
  false,
  modalForPageTransitionElms as modalForPageTransitionElmsType,
  buttonCancelElm,
  sectionElms,
  listDivElms as NodeListOf<HTMLElement>
);
// initial page end

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
      sectionElms,
      listDivElms as NodeListOf<HTMLElement>
    );
  });
});

const closeGlobalMenu = (aGlobalNavElm: HTMLElement) => {
  const bsCollapse = new Collapse(aGlobalNavElm, { toggle: false });
  const mediaQueryList = window.matchMedia('(max-width: 992px)');
  const hideMenus = (matches: boolean) => {
    if (matches) {
      document.addEventListener('click', function (e: MouseEvent) {
        if (aGlobalNavElm.classList.contains('show')) {
          const target = e.target;
          if (target instanceof Node) {
            bsCollapse.hide();
          }
        }
      });
    }
  };

  const listener = (e: MediaQueryListEvent) => {
    hideMenus(e.matches);
  };

  mediaQueryList.addEventListener('change', listener);
  hideMenus(mediaQueryList.matches);
};
if (globalNavElm) {
  closeGlobalMenu(globalNavElm);
}

const bsModal: bootstrap.Modal = new bootstrap.Modal(
  modalForDeleteDivElm as HTMLElement
);

const buttonSaveElm =
  document.querySelector<HTMLButtonElement>('.js-buttonSave');

const listDlElm = document.querySelector('.js-listDl');
const listDtElms = listDlElm?.querySelectorAll('dt');
const listDdElms = document.querySelectorAll('.js-listDd');
const divIdx3Elms = listDdElms[3].querySelectorAll('.js-listDd__divIdx3');
const divIdx3DivElms = divIdx3Elms[1].querySelectorAll(
  '.js-listDd__divIdx3__div'
);
const buttonBackToListElms = document.querySelectorAll('.js-buttonBackToList');

setQuizList(
  quizData as Map<number, Inputs>,
  quizCategory as Map<number, InputsCategory>,
  modalForDeleteElms as modalForDeleteElmsType,
  sectionElms,
  currentValKeys,
  bsModal,
  buttonSaveElm as HTMLButtonElement,
  buttonCancelElm as HTMLButtonElement,
  listDtElms as NodeListOf<HTMLElement>,
  listDdElms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>,
  listDivElms as NodeListOf<HTMLElement>,
  listUlElm as HTMLElement
);

const inputCategoryAreaElm =
  document.querySelector<HTMLElement>('.js-inputCategory');
const buttonAddInputElm =
  document.querySelector<HTMLButtonElement>('.js-buttonAddInput');

deleteDataThroughDeleteBtnInTheModal(
  quizData as Map<number, Inputs>,
  quizCategory as Map<number, InputsCategory>,
  modalForDeleteElms as modalForDeleteElmsType,
  bsModal,
  buttonSaveElm as HTMLButtonElement,
  inputCategoryAreaElm as HTMLElement,
  buttonAddInputElm as HTMLButtonElement,
  buttonCancelElm as HTMLButtonElement,
  sectionElms,
  listDivElms as NodeListOf<HTMLElement>,
  currentValKeys,
  listDdElms as NodeListOf<HTMLElement>,
  listDtElms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>,
  listUlElm as HTMLElement
);

setCategorySettings(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  buttonCancelElm as HTMLButtonElement,
  sectionElms,
  buttonSaveElm as HTMLButtonElement,
  buttonAddInputElm as HTMLButtonElement,
  inputCategoryAreaElm as HTMLElement,
  modalForDeleteElms as modalForDeleteElmsType,
  bsModal,
  listDivElms as NodeListOf<HTMLElement>,
  listUlElm as HTMLElement,
  currentValKeys,
  listDdElms as NodeListOf<HTMLElement>,
  listDtElms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>
);

setAddNew(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  modalForDeleteElms as modalForDeleteElmsType,
  buttonCancelElm as HTMLButtonElement,
  sectionElms,
  bsModal,
  buttonSaveElm as HTMLButtonElement,
  inputCategoryAreaElm as HTMLElement,
  buttonAddInputElm as HTMLButtonElement,
  listDivElms as NodeListOf<HTMLElement>,
  currentValKeys,
  listDdElms as NodeListOf<HTMLElement>,
  listDtElms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>,
  listUlElm as HTMLElement
);

const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');

editQuizData(
  quizData,
  quizCategory,
  listEditBtnElms as NodeListOf<HTMLButtonElement>,
  listDlElm as HTMLElement,
  listDdElms as NodeListOf<HTMLElement>,
  currentValKeys,
  buttonSaveElm as HTMLButtonElement,
  divIdx3Elms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  inputCategoryAreaElm as HTMLElement,
  buttonAddInputElm as HTMLButtonElement,
  buttonCancelElm as HTMLButtonElement,
  modalForDeleteElms as modalForDeleteElmsType,
  bsModal as bootstrap.Modal,
  sectionElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>,
  listDivElms as NodeListOf<HTMLElement>,
  listUlElm as HTMLElement,
  listDtElms as NodeListOf<HTMLElement>
);

setQuizStart(
  quizData,
  quizCategory,
  buttonSaveElm as HTMLButtonElement,
  listUlElm as HTMLElement,
  listDivElms as NodeListOf<HTMLElement>,
  currentValKeys,
  listDdElms as NodeListOf<HTMLElement>,
  sectionElms,
  buttonCancelElm as HTMLButtonElement,
  listDtElms as NodeListOf<HTMLElement>,
  divIdx3DivElms as NodeListOf<HTMLElement>,
  buttonBackToListElms as NodeListOf<HTMLButtonElement>
);
