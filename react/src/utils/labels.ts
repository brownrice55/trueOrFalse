export const typeOptionArray = ["まるばつクイズ", "選択問題"];
export const priorityOptionArray = ["低い", "普通", "高い"];
export const answerArrayText = ["まる", "ばつ"];

import { getCategories } from "./common";
export const categoryNames =
  getCategories()?.categories?.map((val) => val.categoryName) || [];

export type textArraysType = {
  category: string[];
  type: string[];
  priority: string[];
};

export const textArrays: textArraysType = {
  category: categoryNames,
  type: typeOptionArray,
  priority: priorityOptionArray,
};
