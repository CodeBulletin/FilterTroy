import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  API_URL,
  FILTER_ENDPOINT,
  INPUT_IMAGE_ENDPOINT,
  OUTPUT_IMAGE_ENDPOINT,
  FILTER_APPLY,
  FILTER_EXTRA,
} from "./appsettings";
import Axios from "axios";
import {
  validate_data,
  cause_to_effect,
  validate_data_edit,
} from "../Utils/filter_utils";

const initState = {
  code: "def filter(image, variables):\n\treturn image",
  variables: "{\n\t\n}",
  editorOrientation: null,

  filterName: "",
  filterDescription: "",
  userName: "",

  filterId: null,

  InputImagePath: "",
  OutputImagePath: "",

  created_on: null,

  liked: false,
  saved: false,

  likes: 0,
  saves: 0,
  forks: 0,

  fork_id: null,
  switch_to_view: false,

  loading: false,
  processing: false,
  error: null,
  save_error: null,
  get_error: null,
  fork_error: null,
  consoleError: null,

  fork_view_id: null,
  fork_view_name: null,
};

export const saveFilter = createAsyncThunk(
  "filter/saveFilter",
  async (data, { rejectWithValue }) => {
    try {
      const [val, etype, ecause] = validate_data(data);
      if (!val) {
        const err = cause_to_effect(etype, ecause);
        return rejectWithValue(err);
      }
      const form = new FormData();
      for (let key in data) {
        form.append(key, data[key]);
      }
      const response = await Axios.post(API_URL + FILTER_ENDPOINT, form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const getFilter = createAsyncThunk(
  "filter/getFilter",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.get(
        API_URL + FILTER_ENDPOINT + data.filter_id + "/"
      );
      const vars_str = response.data.filter_vars;
      try {
        response.data.filter_vars = JSON.stringify(
          JSON.parse(vars_str),
          null,
          4
        );
      } catch (error) {
        response.data.filter_vars = vars_str;
      }
      const extra_response = await Axios.get(
        API_URL +
          FILTER_EXTRA +
          response.data.filter_id +
          (data.token ? "?token=" + data.token : "")
      );
      console.log(extra_response.data);
      response.data.likes = extra_response.data.likes;
      response.data.saves = extra_response.data.saves;
      response.data.forks = extra_response.data.forks;
      response.data.is_liked = extra_response.data.is_liked;
      response.data.is_saved = extra_response.data.is_saved;
      response.data.fork_id = extra_response.data.is_forked;
      response.data.fork_name = extra_response.data.forkname;
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "filter/toggleLike",
  async (data, { rejectWithValue }) => {
    try {
      const Form = new FormData();
      Form.append("token", data.token);
      const response = await Axios.post(
        API_URL + FILTER_ENDPOINT + "like/" + data.filter_id + "/",
        Form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const toggleSave = createAsyncThunk(
  "filter/toggleSave",
  async (data, { rejectWithValue }) => {
    try {
      const Form = new FormData();
      Form.append("token", data.token);
      const response = await Axios.post(
        API_URL + FILTER_ENDPOINT + "save/" + data.filter_id + "/",
        Form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const makeFork = createAsyncThunk(
  "filter/makeFork",
  async (data, { rejectWithValue }) => {
    try {
      const Form = new FormData();
      Form.append("token", data.token);
      Form.append("new_filter_name", data.filter_name);

      const response = await Axios.post(
        API_URL + FILTER_ENDPOINT + "fork/" + data.filter_id + "/",
        Form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const apply = createAsyncThunk(
  "filter/apply",
  async (data, { rejectWithValue }) => {
    try {
      if (data.code === "" || data.code === null || data.code === undefined) {
        return rejectWithValue("Code is empty");
      }
      if (
        data.image === "" ||
        data.image === null ||
        data.image === undefined
      ) {
        return rejectWithValue("Image is empty");
      }
      const Form = new FormData();
      Form.append("code", data.code);
      Form.append("vars", data.vars);
      Form.append("image", data.image);

      const response = await Axios.post(API_URL + FILTER_APPLY, Form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

export const editFilter = createAsyncThunk(
  "filter/editFilter",
  async (data, { rejectWithValue }) => {
    try {
      // remove filter id from data
      const id = data.filter_id;
      delete data.filter_id;
      const [val, etype, ecause] = validate_data_edit(data);
      if (!val) {
        const err = cause_to_effect(etype, ecause);
        return rejectWithValue(err);
      }
      const form = new FormData();
      for (let key in data) {
        form.append(key, data[key]);
      }
      const response = await Axios.patch(
        API_URL + FILTER_ENDPOINT + id + "/",
        form,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.detail);
    }
  }
);

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
    setEditorOrientation: (state, action) => {
      state.editorOrientation = action.payload;
    },
    setFilterId: (state, action) => {
      state.filterId = action.payload;
    },
    setInputImagePath: (state, action) => {
      state.InputImagePath = action.payload;
    },
    setOutputImagePath: (state, action) => {
      state.OutputImagePath = action.payload;
    },
    setFilterName: (state, action) => {
      state.filterName = action.payload;
    },
    setFilterDescription: (state, action) => {
      state.filterDescription = action.payload;
    },
    setForkId: (state, action) => {
      state.fork_id = action.payload;
    },
    clearData: (state) => {
      for (let key in initState) {
        state[key] = initState[key];
      }
    },
    clearConsoleError: (state) => {
      state.consoleError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveFilter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(saveFilter.fulfilled, (state, action) => {
      console.log(action.payload);
      state.loading = false;
      state.filterId = action.payload;
      state.switch_to_view = "view";
    });
    builder.addCase(saveFilter.rejected, (state, action) => {
      state.loading = false;
      state.save_error = action.payload;
      state.get_error = null;
      state.fork_error = null;
    });
    builder.addCase(getFilter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFilter.fulfilled, (state, action) => {
      state.loading = false;
      state.created_on = action.payload.created_on;
      state.code = action.payload.filter_code;
      state.variables = action.payload.filter_vars;
      state.filterName = action.payload.filter_name;
      state.filterDescription = action.payload.filter_desc;
      state.userName = action.payload.user_name;
      state.InputImagePath = action.payload.input_image_path;
      state.OutputImagePath = action.payload.output_image_path;
      state.editorOrientation = action.payload.initial_orientation;
      state.likes = action.payload.likes;
      state.saves = action.payload.saves;
      state.forks = action.payload.forks;
      state.liked = action.payload.is_liked;
      state.saved = action.payload.is_saved;
      state.filterId = action.payload.filter_id;
      state.fork_view_id = action.payload.fork_id;
      state.fork_view_name = action.payload.fork_name;
    });
    builder.addCase(getFilter.rejected, (state) => {
      state.loading = false;
      state.get_error = "Error getting filter";
      state.save_error = null;
      state.fork_error = null;
    });
    builder.addCase(toggleLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      state.loading = false;
      state.liked = action.payload.like;
      state.likes = action.payload.like_count;
    });
    builder.addCase(toggleLike.rejected, (state) => {
      state.loading = false;
      state.error = "Error toggling like";
    });
    builder.addCase(toggleSave.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleSave.fulfilled, (state, action) => {
      state.loading = false;
      state.saved = action.payload.save;
      state.saves = action.payload.save_count;
    });
    builder.addCase(toggleSave.rejected, (state) => {
      state.loading = false;
      state.error = "Error toggling save";
    });
    builder.addCase(makeFork.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(makeFork.fulfilled, (state, action) => {
      state.loading = false;
      state.fork_id = action.payload;
      state.switch_to_view = "edit";
    });
    builder.addCase(makeFork.rejected, (state) => {
      state.loading = false;
      state.fork_error = "Error forking filter";
      state.save_error = null;
      state.get_error = null;
    });
    builder.addCase(apply.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(apply.fulfilled, (state, action) => {
      state.processing = false;
      state.OutputImagePath = action.payload;
    });
    builder.addCase(apply.rejected, (state, action) => {
      state.processing = false;
      state.consoleError = action.payload;
    });
    builder.addCase(editFilter.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editFilter.fulfilled, (state, action) => {
      state.loading = false;
      state.filterId = action.payload;
      state.switch_to_view = "view";
    });
    builder.addCase(editFilter.rejected, (state, action) => {
      state.loading = false;
      state.save_error = action.payload;
      state.get_error = null;
      state.fork_error = null;
    });
  },
});

export const {
  setCode,
  setVariables,
  setEditorOrientation,
  setFilterId,
  setInputImagePath,
  setOutputImagePath,
  setFilterName,
  setFilterDescription,
  setForkId,
  clearData,
  clearConsoleError,
} = filterSlice.actions;

export default filterSlice.reducer;
