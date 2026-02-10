export type Listener = {
  initialInputValues: string[];
  buttonSaveElm: HTMLButtonElement;
  buttonCancelElm: HTMLButtonElement;
  isUnderEdit: boolean;
  handleEvent(this: Listener, e: KeyboardEvent): void;
};
