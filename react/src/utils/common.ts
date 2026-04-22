import type { Inputs } from "../types/inputs.type";
import type { InputsCategory } from "../types/inputsCategory.type";

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

export function getCategories(): InputsCategory {
  const raw = localStorage.getItem("TrueOrFalseCategory");
  const data: {
    categoryId: number;
    categoryName: string;
    isActive: boolean;
  }[] = raw
    ? JSON.parse(raw)
    : [{ categoryId: 0, categoryName: "", isActive: false }];
  return { categories: data };
}
