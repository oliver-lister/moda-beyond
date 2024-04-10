import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import UserProps from "../../types/UserProps";
import { RootState } from "../store";
import { CartItemProps } from "../../types/UserProps";

// Types

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: UserProps | null;
  isLoading: boolean;
}

interface LoginValues {
  email: string;
  password: string;
}

interface LoginPayload {
  user: UserProps;
  accessToken: string;
  refreshToken: string;
}

interface SignupPayload {
  newUser: UserProps;
  accessToken: string;
  refreshToken: string;
}

interface SignupValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  newsletter: boolean;
  shoppingPreference: string;
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = "";
      state.refreshToken = "";
      state.user = null;
    })
    .addCase(
      loginAsync.fulfilled,
      (state, action: PayloadAction<LoginPayload>) => {
        const { user, accessToken, refreshToken } = action.payload;

        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.isLoading = false;
      }
    )
    .addCase(loginAsync.rejected, (state) => {
      state.isLoading = false;
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.accessToken = "";
      state.refreshToken = "";
      state.user = null;
    })
    .addCase(
      signupAsync.fulfilled,
      (state, action: PayloadAction<SignupPayload>) => {
        const { newUser, accessToken, refreshToken } = action.payload;

        state.user = newUser;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        state.isLoading = false;
      }
    )
    .addCase(signupAsync.rejected, (state) => {
      state.isLoading = false;
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
    .addCase(refreshAccessTokenAsync.fulfilled, (state, action) => {
      const { newAccessToken, newRefreshToken, user } = action.payload;

      state.accessToken = newAccessToken;
      state.refreshToken = newRefreshToken;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      state.isLoading = false;
      state.user = user;
    })
    .addCase(refreshAccessTokenAsync.rejected, (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.user = null;
      state.isLoading = false;
    });
};

// Fetch user data

export const fetchUserDataAsync = createAsyncThunk(
  "auth/fetchUserDataAsync",
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.user) throw new Error("No user logged in.");
      const userId = auth.user._id.toString();
      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/fetchdata`,
        {
          method: "GET",
          headers: {
            Authorization: accessToken,
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error fetching user data:", err.message);
        throw err;
      }
    }
  }
);

const fetchUserDataReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder.addCase(
    fetchUserDataAsync.fulfilled,
    (state, action: PayloadAction<AuthState>) => {
      const { user } = action.payload;
      state.user = user;
    }
  );
};

// CART REDUCERS

// Add to Cart

export const addToCartAsync = createAsyncThunk(
  "auth/addToCartAsync",
  async (
    { productId, color, quantity, size, price }: CartItemProps,
    thunkAPI
  ) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.user) {
        throw new Error(`User not logged in`);
      }
      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }
      const userId = auth.user._id.toString();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          body: JSON.stringify({
            productId: productId,
            color: color,
            quantity: quantity,
            size: size,
            price: price,
          }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      thunkAPI.dispatch(fetchUserDataAsync());
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error: " + err.message);
        throw err;
      }
    }
  }
);

const addtoCartReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder
    .addCase(addToCartAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(addToCartAsync.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(addToCartAsync.rejected, (state) => {
      state.isLoading = false;
    });
};

// Update Cart

export const updateCartAsync = createAsyncThunk(
  "auth/updateCartAsync",
  async (newCart: CartItemProps[], thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.user) {
        throw new Error(`User not logged in`);
      }

      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }
      const userId = auth.user._id.toString();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/cart/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          body: JSON.stringify({
            newCart: newCart,
          }),
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      const { cart } = responseData;
      thunkAPI.dispatch(fetchUserDataAsync());
      return cart;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error: " + err.message);
        throw err;
      }
    }
  }
);

const updateCartReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder.addCase(updateCartAsync.fulfilled, (state, action) => {
    if (state.user) {
      state.user.cart = action.payload;
    }
  });
};

// REDUX TK INIT

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  user: null,
  isLoading: true,
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
      state.user = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    loginReducerBuilder(builder);
    signupReducerBuilder(builder);
    refreshAccessTokenReducerBuilder(builder);
    fetchUserDataReducerBuilder(builder);
    addtoCartReducerBuilder(builder);
    updateCartReducerBuilder(builder);
  },
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
