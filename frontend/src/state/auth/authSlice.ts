import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { SignupValues } from "../../routes/LoginSignup/components/Signup";
import { LoginValues } from "../../routes/LoginSignup/components/Login";

// Types

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}

interface LoginPayload {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

interface SignupPayload {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshPayload {
  userId: string;
  newAccessToken: string;
  newRefreshToken: string;
}

// AUTHENTICATION REDUCERS

// User login

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (values: LoginValues) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }
      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error submitting login form:", err.message);
        throw err;
      }
    }
  }
);

const loginReducerBuilder = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(loginAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      loginAsync.fulfilled,
      (state, action: PayloadAction<LoginPayload>) => {
        const { userId, accessToken, refreshToken } = action.payload;

        state.userId = userId;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.isLoading = false;
      }
    )
    .addCase(loginAsync.rejected, (state) => {
      state.isLoading = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.userId = null;
    });
};

// User signup

export const signupAsync = createAsyncThunk(
  "auth/signupAsync",
  async (values: SignupValues) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error submitting signup form:", err.message);
        throw err;
      }
    }
  }
);

const signupReducerBuilder = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(signupAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      signupAsync.fulfilled,
      (state, action: PayloadAction<SignupPayload>) => {
        const { userId, accessToken, refreshToken } = action.payload;

        state.userId = userId;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.isLoading = false;
      }
    )
    .addCase(signupAsync.rejected, (state) => {
      state.isLoading = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.userId = null;
    });
};

// Refresh Access Token using Refresh Token

export const refreshAccessTokenAsync = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken: string | null) => {
    if (!refreshToken) throw new Error("No refresh token supplied.");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/auth/refreshtoken`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }
      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error refreshing access token: ", err.message);
        throw err;
      }
    }
  }
);

const refreshAccessTokenReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder
    .addCase(refreshAccessTokenAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      refreshAccessTokenAsync.fulfilled,
      (state, action: PayloadAction<RefreshPayload>) => {
        const { newAccessToken, newRefreshToken, userId } = action.payload;

        state.accessToken = newAccessToken;
        state.refreshToken = newRefreshToken;
        state.userId = userId;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        state.isLoading = false;
      }
    )
    .addCase(refreshAccessTokenAsync.rejected, (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.userId = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    });
};

// REDUX TK INIT

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  userId: null,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state: AuthState) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = "";
      state.refreshToken = "";
      state.userId = null;
      state.isLoading = false;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    loginReducerBuilder(builder);
    signupReducerBuilder(builder);
    refreshAccessTokenReducerBuilder(builder);
  },
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
