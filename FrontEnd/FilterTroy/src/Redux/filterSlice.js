import { createSlice } from "@reduxjs/toolkit";

const initState = {
  code: "def filter(image, variables):\n\treturn image",
  variables: "{\n\t\n}",
  editorFontSize: 14,
  editorOrientation: "0",
  variablesValues: {},
};

const filterSlice = createSlice({
  name: "filter",
  initialState: initState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setVariables: (state, action) => {
      state.variables = action.payload;
    },
    setEditorFontSize: (state, action) => {
      state.editorFontSize = action.payload;
    },
    setEditorOrientation: (state, action) => {
      state.editorOrientation = action.payload;
    },
    setVariablesValues: (state, action) => {
      state.variablesValues = action.payload;
    },
  },
});

export const {
  setCode,
  setVariables,
  setEditorFontSize,
  setEditorOrientation,
  setVariablesValues,
} = filterSlice.actions;

export default filterSlice.reducer;
