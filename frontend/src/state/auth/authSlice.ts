import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import UserProps from "../../types/UserProps";
import { RootState } from "../store";
import { CartItemProps } from "../../types/UserProps";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: UserProps | null;
  isLoading: boolean;
}

// AUTHENTICATION REDUCERS

// User login

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
      if (err instanceof Error) {
        console.error("Error submitting login form:", err.message);
        throw err;
      }
    }
  }
);

interface loginSignupPayload {
  user: UserProps;
  accessToken: string;
  refreshToken: string;
}

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
      (state, action: PayloadAction<loginSignupPayload>) => {
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
      if (err instanceof Error) {
        console.error("Error submitting signup form:", err.message);
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
      (state, action: PayloadAction<loginSignupPayload>) => {
        const { user, accessToken, refreshToken } = action.payload;

        state.user = user;
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
      if (err instanceof Error) {
        console.error("Error refreshing access token: ", err.message);
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
      const userId = auth.user._id;
      const accessToken = auth.accessToken;
      const response = await fetch(
        `http://localhost:3000/users/fetchuser?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && {
              Authorization: accessToken,
            }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const userData = await response.json();
      return userData;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching user data:", err.message);
        throw err;
      }
    }
  }
);

const fetchUserDataReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder
    .addCase(fetchUserDataAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      fetchUserDataAsync.fulfilled,
      (state, action: PayloadAction<UserProps>) => {
        state.user = action.payload;
        state.isLoading = false;
      }
    )
    .addCase(fetchUserDataAsync.rejected, (state) => {
      state.isLoading = false;
    });
};

// CART REDUCERS

// Add to Cart

export const addToCartAsync = createAsyncThunk(
  "auth/addToCartAsync",
  async ({ productId, color, quantity, size }: CartItemProps, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      const accessToken = auth.accessToken;

      const response = await fetch(`http://localhost:3000/users/addtocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: accessToken }),
        },
        body: JSON.stringify({
          productId: productId,
          color: color,
          quantity: quantity,
          size: size,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error adding product to cart: ${errorMessage}`);
      }

      thunkAPI.dispatch(fetchUserDataAsync());
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error: " + err.message);
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
      const accessToken = auth.accessToken;

      const response = await fetch(`http://localhost:3000/users/updatecart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: accessToken }),
        },
        body: JSON.stringify({
          newCart: newCart,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error updating cart: ${errorMessage}`);
      }

      const { cart } = await response.json();
      return cart;
      // thunkAPI.dispatch(fetchUserDataAsync());
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error: " + err.message);
        throw err;
      }
    }
  }
);

const updateCartReducerBuilder = (
  builder: ActionReducerMapBuilder<AuthState>
) => {
  builder
    .addCase(updateCartAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.user) {
        state.user.cart = action.payload;
      }
    })
    .addCase(updateCartAsync.rejected, (state) => {
      state.isLoading = false;
    });
};

// REDUX TK INIT

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  user: null,
  isLoading: false,
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
