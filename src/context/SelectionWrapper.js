import React, { createContext, useContext, useState } from "react";

const SelectionContext = createContext();

export const SelectionWrapper = ({ children }) => {
  const [selection, setSelection] = useState([]);

  const updateSelection = (newSelection) => {
    if (selection.length == 0) {
      setSelection([...selection, newSelection]);
    } else {
      if (selection.includes(newSelection)) {
        const filtered = selection.filter((item) => item !== newSelection);
        setSelection([...filtered]);
      } else {
        setSelection([...selection, newSelection]);
      }
    }
  };

  const resetSelection = () => {
    setSelection([]);
  };

  return (
    <SelectionContext.Provider
      value={{ selection, updateSelection, resetSelection }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  return useContext(SelectionContext);
};
