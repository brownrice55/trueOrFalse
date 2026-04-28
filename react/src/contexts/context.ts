import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Inputs } from "../types/inputs.type";

interface DataContextType {
  data: Map<number, Inputs>;
  setData: Dispatch<SetStateAction<Map<number, Inputs>>>;
}

export const DataContext = createContext<DataContextType | null>(null);
