import { createContext } from "react";
import type { DataContextType } from "../types/dataContextType.type";

export const DataContext = createContext<DataContextType | null>(null);
