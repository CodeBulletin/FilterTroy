export const validate_data = (data) => {
  const reqired_keys = [
    "filter_name",
    "filter_desc",
    "initial_orientation",
    "code",
    "variables",
    "image_input",
    "image_output",
    "token",
  ];

  for (let key of reqired_keys) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      return [false, "missing", key];
    }
  }

  // validate if variables are in json format
  try {
    JSON.parse(data["variables"]);
  } catch (e) {
    return [false, "invalid", "variables"];
  }

  return [true, "success", null];
};

export const validate_data_edit = (data) => {
  const reqired_keys = [
    "filter_desc",
    "initial_orientation",
    "code",
    "variables",
    "image_input",
    "image_output",
    "token",
  ];

  for (let key of reqired_keys) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      return [false, "missing", key];
    }
  }

  // validate if variables are in json format
  try {
    JSON.parse(data["variables"]);
  } catch (e) {
    return [false, "invalid", "variables"];
  }

  return [true, "success", null];
};

export const cause_to_effect = (cause, field) => {
  let c = "";
  let f = "";
  if (cause === "missing") {
    c = "Missing required field";
  } else if (cause === "invalid") {
    c = "Invalid field format";
  } else {
    c = cause;
  }
  if (field === "filter_id") {
    f = "Filter ID";
  } else if (field === "filter_name") {
    f = "Filter name";
  } else if (field === "filter_desc") {
    f = "Filter description";
  } else if (field === "initial_orientation") {
    f = "Initial orientation";
  } else if (field === "code") {
    f = "Code";
  } else if (field === "variables") {
    f = "Variables";
  } else if (field === "image_input") {
    f = "Input image";
  } else if (field === "image_output") {
    f = "Output image, Please apply filter to this image";
  } else {
    f = field;
  }

  return `${c}: ${f}`;
};
