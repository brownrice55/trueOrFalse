import type { modalForDeleteElmsType } from './modalForDeleteElms.type';
export type ListenerForShowModalForDeleteType = {
  targetInputElm: HTMLInputElement | null;
  modalForDeleteElms: modalForDeleteElmsType;
  listDdElms: NodeListOf<HTMLElement> | null;
  bsModal: bootstrap.Modal;
  handleEvent(this: ListenerForShowModalForDeleteType, e: MouseEvent): void;
};
