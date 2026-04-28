import type { Dispatch, SetStateAction } from "react";
import type { Inputs } from "./inputs.type";

export type DataContextType = {
  data: Map<number, Inputs>;
  setData: Dispatch<SetStateAction<Map<number, Inputs>>>;
};
