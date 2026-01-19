export function getDataFromLocalStorage(aName: string) {
  let data = aName === 'quizCategory' ? [] : new Map();
  const dataFromLocalStorage: string | null = localStorage.getItem(aName);
  if (dataFromLocalStorage !== 'undefined') {
    if (typeof dataFromLocalStorage === 'string') {
      const dataJson = JSON.parse(dataFromLocalStorage);
      data = new Map(dataJson);
    } else {
      data = new Map(null);
    }
  }
  return data;
}
