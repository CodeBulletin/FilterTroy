import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  API_URL,
  LoginEndpoint,
  SignUpEndpoint,
  UserValidateEndpoint,
} from "./appsettings";
import {
  validateLoginData,
  validateSignUpData,
  arraybufferToBase64,
  arraybufferToString,
} from "../Utils/utils";

const inititalState = {
  username: null,
  profile_picture: null,
  email: null,
  is_disabled: false,
  isLogged: false,
  loading: false,
  error: null,
  jwt: null,
};

const login = async (data) => {
  try {
    const response = await axios.post(
      API_URL + LoginEndpoint,
      {
        username: data.username,
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    const user_data = JSON.parse(response.headers["x-user-info"]);
    const token = response.headers["authorization"];
    const image = arraybufferToBase64(response.data);

    const payload = {
      username: user_data.username,
      profile_picture: image,
      email: user_data.email,
      is_disabled: user_data.is_disabled,
      token: token,
    };

    return payload;
  } catch (error) {
    const msg = error.response
      ? JSON.parse(arraybufferToString(error.response.data)).detail
      : error.message;
    return {
      error: msg,
    };
  }
};

const signup = async (data) => {
  try {
    const form = new FormData();
    form.append("username", data.username);
    form.append("email", data.email);
    form.append("password", data.password);
    form.append("file", data.profile_picture);
    const response = await axios.post(API_URL + SignUpEndpoint, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 201) {
      return {
        message: "User created successfully",
      };
    } else {
      return {
        error: response.data.detail,
      };
    }
  } catch (error) {
    return {
      error: error.response ? error.response.data.detail : error.message,
    };
  }
};

export const login_fn = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = validateLoginData(data);
      if (response !== false) {
        return rejectWithValue({
          message: response.error,
        });
      }
      const payload = await login(data);
      if (payload.error) {
        return rejectWithValue({
          message: payload.error,
        });
      }
      return payload;
    } catch (error) {
      return rejectWithValue({
        message: error.response ? error.response.data.detail : error.message,
      });
    }
  }
);

export const signup_fn = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      let response = validateSignUpData(data);
      if (response !== false) {
        return rejectWithValue({
          message: response.error,
        });
      }

      response = await signup(data);
      if (response.error) {
        return rejectWithValue({
          message: response.error,
        });
      }

      const payload = await login({
        username: data.username,
        password: data.password,
      });
      if (payload.error) {
        return rejectWithValue({
          message: payload.error,
        });
      }

      return payload;
    } catch (error) {
      return rejectWithValue({
        message: error.response ? error.response.data.detail : error.message,
      });
    }
  }
);

export const validate_fn = createAsyncThunk(
  "auth/validateToken",
  async (data, { rejectWithValue }) => {
    try {
      if (!data.token) {
        return rejectWithValue({
          message: "Invalid token",
        });
      }
      const form = new FormData();
      form.append("token", data.token);
      const response = await axios.post(API_URL + UserValidateEndpoint, form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: "Invalid token",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: inititalState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.isLogged = false;
      state.loading = false;
      state.error = null;
      state.jwt = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login_fn.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isLogged = false;

      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.jwt = null;
    });
    builder.addCase(login_fn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.username = action.payload.username;
      state.profile_picture = action.payload.profile_picture;
      state.email = action.payload.email;
      state.is_disabled = action.payload.is_disabled;
      state.isLogged = true;
      state.jwt = action.payload.token;
    });
    builder.addCase(login_fn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.isLogged = false;

      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.jwt = null;
    });
    builder.addCase(signup_fn.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isLogged = false;

      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.jwt = null;
    });

    builder.addCase(signup_fn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.username = action.payload.username;
      state.profile_picture = action.payload.profile_picture;
      state.email = action.payload.email;
      state.is_disabled = action.payload.is_disabled;
      state.isLogged = true;
      state.jwt = action.payload.token;
    });

    builder.addCase(signup_fn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
      state.isLogged = false;

      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.jwt = null;
    });
    builder.addCase(validate_fn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(validate_fn.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.isLogged = true;
    });
    builder.addCase(validate_fn.rejected, (state, action) => {
      state.loading = false;
      state.isLogged = false;
      state.error = action.payload.message;

      state.username = null;
      state.profile_picture = null;
      state.email = null;
      state.is_disabled = false;
      state.jwt = null;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
