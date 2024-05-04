import { createSlice } from "@reduxjs/toolkit";

const initState = {
  code: "def filter(image, variables):\n\treturn image",
  variables: "{\n\t\n}",
  editorFontSize: 14,
  editorOrientation: "0",
  variablesValues: {},

  openMode: "New", // New, Clone, View
  filterId: null,
  filteCloneId: null,
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

    setOpenMode: (state, action) => {
      state.openMode = action.payload;
    },

    setFilterId: (state, action) => {
      state.filterId = action.payload;
    },

    setFilterCloneId: (state, action) => {
      state.filteCloneId = action.payload;
    },
  },
});

export const {
  setCode,
  setVariables,
  setEditorFontSize,
  setEditorOrientation,
  setVariablesValues,
  setOpenMode,
  setFilterId,
  setFilterCloneId,
} = filterSlice.actions;

export default filterSlice.reducer;
