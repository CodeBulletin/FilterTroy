import { Buffer } from "buffer";

export const validateUsername = (username) => {
  if (username === "") {
    return {
      error: "Please enter a username",
    };
  }
  if (username.length < 4 || username.length > 20) {
    return {
      error: "Username must be between 4 and 20 characters",
    };
  }
  const regex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!regex.test(username)) {
    return {
      error:
        "Username must start with a letter and contain only letters, numbers, and underscores",
    };
  }
  return false;
};

export const validatePassword = (password, confirm_password = null) => {
  if (password === "") {
    return {
      error: "Please enter a password",
    };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters",
    };
  }
  if (confirm_password === null) {
    return false;
  }
  if (password !== confirm_password) {
    return {
      error: "Passwords do not match",
    };
  }
  return false;
};

export const validateEmail = (email) => {
  if (email === "") {
    return {
      error: "Please enter an email",
    };
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    return {
      error: "Please enter a valid email",
    };
  }
  return false;
};

export const validateProfilePicture = (profile_picture) => {
  if (profile_picture === null) {
    return {
      error: "Please upload a profile picture",
    };
  }

  // check extension
  const allowedExtensions = ["jpeg", "jpg", "png"];
  const extension = profile_picture.name.split(".").pop();
  if (!allowedExtensions.includes(extension)) {
    return {
      error: "Profile picture must be a jpeg, jpg, or png",
    };
  }

  return false;
};

export const validateSignUpData = (data) => {
  // Validate username
  let response = validateUsername(data.username);
  if (response !== false) {
    return response;
  }

  // Validate password
  response = validatePassword(data.password, data.confirm_password);
  if (response !== false) {
    return response;
  }

  // Validate email
  response = validateEmail(data.email);
  if (response !== false) {
    return response;
  }

  // Validate profile picture
  response = validateProfilePicture(data.profile_picture);
  if (response !== false) {
    return response;
  }

  return false;
};

export const validateLoginData = (data) => {
  // Validate username
  let response = validateUsername(data.username);
  if (response !== false) {
    return {
      error: "Invalid username or password",
    };
  }

  // Validate password
  response = validatePassword(data.password);
  if (response !== false) {
    return {
      error: "Invalid username or password",
    };
  }

  return false;
};

export const arraybufferToBase64 = (buffer) => {
  return "data:image/jpeg;base64," + Buffer.from(buffer).toString("base64");
};

export const arraybufferToString = (buffer) => {
  return Buffer.from(buffer).toString();
};

export const strtojson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};
