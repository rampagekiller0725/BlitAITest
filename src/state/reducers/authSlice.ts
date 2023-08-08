import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { parseToken, isExpiredToken } from "utilities";

interface Authorization {
  idToken: string;
  username: string;
  name: string;
  email: string;
}

const getIdToken = () => {
  const idToken = localStorage.getItem("idToken");
  if (idToken !== null) {
    const tokenData = parseToken(idToken);
    if (!isExpiredToken(tokenData)) {
      return idToken;
    }
  }
  return "";
};

const getUsername = () => {
  const idToken = localStorage.getItem("idToken");
  if (idToken !== null && idToken !== "") {
    const tokenData = parseToken(idToken);
    if (!isExpiredToken(tokenData)) {
      return tokenData["cognito:username"];
    }
  }
  return "";
};

const getEmail = () => {
  const idToken = localStorage.getItem("idToken");
  if (idToken !== null && idToken !== "") {
    const tokenData = parseToken(idToken);
    if (!isExpiredToken(tokenData)) {
      return tokenData["email"];
    }
  }
  return "";
};

const initialState: Authorization = {
  idToken: getIdToken(),
  username: getUsername(),
  name: "",
  email: getEmail(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action) {
      state.idToken = action.payload.idToken;
    },
    setUserData(state, action) {
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const selectUsername = (state: RootState) => state.authSlice.username;

export const selectName = (state: RootState) => state.authSlice.name;

export const selectEmail = (state: RootState) => state.authSlice.email;

export const selectIdToken = (state: RootState) => state.authSlice.idToken;

export const selectIsAuthenticated = (state: RootState) => {
  const idToken = getIdToken();
  if (idToken !== "" && !isExpiredToken(parseToken(idToken))) {
    return true;
  }
  return false;
};

export const { setUserData, setTokens } = authSlice.actions;

export default authSlice.reducer;
