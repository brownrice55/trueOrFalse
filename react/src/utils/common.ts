import type { Inputs } from "../types/inputs.type";
export function getData() {
  let data = new Map<number, Inputs>();
  const dataFromLocalStorage: string | null =
    localStorage.getItem("trueOrFalseData");
  if (dataFromLocalStorage !== "undefined") {
    let dataJson: any;
    if (typeof dataFromLocalStorage === "string") {
      dataJson = JSON.parse(dataFromLocalStorage);
    } else {
      dataJson = null;
    }
    data = new Map(dataJson);
  }
  return data;
}
