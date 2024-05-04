import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL, LoginEndpoint, SignUpEndpoint } from "./appsettings";
import { Buffer } from "buffer";

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

export const arraybufferToBase64 = (buffer) => {
  return "data:image/jpeg;base64," + Buffer.from(buffer).toString("base64");
};

export const login_fn = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
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

      console.log("login: ", payload);
      return payload;
    } catch (error) {
      console.log("login error: ", error);
      return rejectWithValue({
        message: error.response.data.detail,
      });
    }
  }
);

export const signup_fn = createAsyncThunk(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    console.log("signup data: ", data);
    try {
      if (data.username === "") {
        return rejectWithValue({
          message: "Please enter a username",
        });
      }
      if (data.email === "") {
        return rejectWithValue({
          message: "Please enter an email",
        });
      }
      if (data.password === "") {
        return rejectWithValue({
          message: "Please enter a password",
        });
      }
      if (data.confirm_password === "") {
        return rejectWithValue({
          message: "Please confirm your password",
        });
      }
      if (data.profile_picture === null) {
        return rejectWithValue({
          message: "Please upload a profile picture",
        });
      }
      if (data.password !== data.confirm_password) {
        return rejectWithValue({
          message: "Passwords do not match",
        });
      }
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
      console.log("signup: ", response);
      // if (response.status === 201) {
      //   const loginResponse = await axios.post(API_URL + LoginEndpoint, {
      //     username: data.username,
      //     password: data.password,
      //   });
      //   console.log("signup -> login: ", loginResponse);
      //   return loginResponse.data;
      // } else {
      //   return rejectWithValue({
      //     message: response.data,
      //   });
      // }
      return rejectWithValue({
        message: "Not implemented yet.",
      });
    } catch (error) {
      console.log("signup error: ", error.response.data.detail);
      return rejectWithValue({
        message: error.response.data.detail,
      });
    }
  }
);

export const validateToken_fn = createAsyncThunk(
  "auth/validateToken",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL + UserDetailEndpoint, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      });
      console.log("validateToken: ", response);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response.data,
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
    });
    builder.addCase(signup_fn.pending, (state) => {
      console.log("signup_fn.pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup_fn.fulfilled, (state, action) => {
      console.log("signup_fn.fulfilled");
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
      console.log("signup_fn.rejected", action.payload.message);
      state.loading = false;
      state.error = action.payload.message;
    });
    builder.addCase(validateToken_fn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(validateToken_fn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.isLogged = true;
    });
    builder.addCase(validateToken_fn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
