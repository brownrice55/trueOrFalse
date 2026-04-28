import { useState } from "react";
import type { ReactNode } from "react";
import { getData } from "../utils/common";
import { DataContext } from "./context";
import type { Inputs } from "../types/inputs.type";

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Map<number, Inputs>>(getData());
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}
