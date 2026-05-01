export const typeOptionArray = ["まるばつクイズ", "選択問題"];
export const priorityOptionArray = ["低い", "普通", "高い"];
export const answerArrayText = ["まる", "ばつ"];

import { getCategories } from "./common";
const originalCategories = getCategories();
export const categoryNameArray = [...originalCategories.categories].map(
  (val) => val.categoryName,
);
