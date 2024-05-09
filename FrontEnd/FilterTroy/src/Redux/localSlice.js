import { createSlice } from "@reduxjs/toolkit";

const initState_p = {
  editorFontSize: 14,
};

const initState_np = {
  editorLocalOrientation: null,
  variablesValue: {},
  filteCloneId: null,
  localInputImage: null,
  localOutputImage: null,
};

const localSlice = createSlice({
  name: "local_presistant_data",
  initialState: initState_p,
  reducers: {
    setEditorFontSize: (state, action) => {
      state.editorFontSize = action.payload;
    },
  },
});

const localSliceNoPresist = createSlice({
  name: "local_data",
  initialState: initState_np,
  reducers: {
    setEditorLocalOrientation: (state, action) => {
      state.editorLocalOrientation = action.payload;
    },
    setVariablesValue: (state, action) => {
      state.variablesValue = action.payload;
    },
    setFilterCloneId: (state, action) => {
      state.filterCloneId = action.payload;
    },
    setInputImage: (state, action) => {
      state.localInputImage = action.payload;
    },
    setOutputImage: (state, action) => {
      state.localOutputImage = action.payload;
    },
  },
});

export const {
  setEditorLocalOrientation,
  setVariablesValue,
  setOpenMode,
  setFilterCloneId,
  setInputImage,
  setOutputImage,
} = localSliceNoPresist.actions;

export const { setEditorFontSize } = localSlice.actions;

export { localSlice, localSliceNoPresist };
