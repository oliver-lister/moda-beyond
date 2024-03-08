import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserProps from "../../types/UserProps";

interface loginSignupPayload {
  user: UserProps;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: UserProps | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = "";
      state.refreshToken = "";
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<loginSignupPayload>) => {
          const { user, accessToken, refreshToken } = action.payload;

          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          state.isAuthenticated = true;
          state.isLoading = false;
        }
      )
      .addCase(signupAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        signupAsync.fulfilled,
        (state, action: PayloadAction<loginSignupPayload>) => {
          const { user, accessToken, refreshToken } = action.payload;

          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          state.isAuthenticated = true;
          state.isLoading = false;
        }
      )
      .addCase(refreshAccessTokenAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAccessTokenAsync.fulfilled, (state, action) => {
        const { newAccessToken, newRefreshToken, user } = action.payload;

        state.accessToken = newAccessToken;
        state.refreshToken = newRefreshToken;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = user;
      })
      .addCase(refreshAccessTokenAsync.rejected, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(fetchUserDataAsync.pending, (state) => {
        state.isLoading = true;
        console.log("fetchUserDataAsync pending");
      })
      .addCase(
        fetchUserDataAsync.fulfilled,
        (state, action: PayloadAction<UserProps>) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      );
  },
});

interface LoginValues {
  email: string;
  password: string;
}

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (values: LoginValues) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to login.");
      }

      const responseData = await response.json();

      return responseData;
    } catch (err) {
      console.error("Error submitting form:", err);
      throw err;
    }
  }
);

interface SignupValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  newsletter: boolean;
  shoppingPreference: string;
}

export const signupAsync = createAsyncThunk(
  "auth/signupAsync",
  async (values: SignupValues) => {
    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to register new user: " + values);
      }

      const responseData = await response.json();

      return responseData;
    } catch (err) {
      console.error("Error submitting signup form:", err);
      throw err;
    }
  }
);

export const refreshAccessTokenAsync = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/refreshtoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh access token.");
      }

      const responseData = await response.json();

      return responseData;
    } catch (err) {
      console.error("Error refreshing access token:", err);
      throw err;
    }
  }
);

interface FetchUserDataAsyncParams {
  userId: string;
  accessToken?: string; // Make sure accessToken is optional if it can be undefined
}

export const fetchUserDataAsync = createAsyncThunk(
  "auth/fetchUserDataAsync",
  async ({ userId, accessToken }: FetchUserDataAsyncParams) => {
    try {
      const response = await fetch(`http://localhost:3000/users/fetchuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: accessToken }),
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const userData = await response.json();
      return userData;
    } catch (err) {
      console.error("Fetch user data error:", err);
      throw err;
    }
  }
);

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
