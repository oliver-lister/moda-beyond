import UserProps from "../../types/UserProps";
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { EditProfileValues } from "../../routes/Account/Profile/components/EditProfileForm";
import { EditLoginAndSecurityValues } from "../../routes/Account/LoginAndSecurity/components/EditLoginAndSecurityForm";

export interface UserState {
  isLoading: boolean;
  data: UserProps | null;
}

interface FetchUserPayload {
  user: UserProps;
}

interface UpdateUserPayload {
  user: UserProps;
}

export const fetchUserDataAsync = createAsyncThunk(
  "user/fetchUserDataAsync",
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.userId) throw new Error("No user logged in.");
      const userId = auth.userId;
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
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder
    .addCase(fetchUserDataAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      fetchUserDataAsync.fulfilled,
      (state, action: PayloadAction<FetchUserPayload>) => {
        const { user } = action.payload;
        state.data = user;
        state.isLoading = false;
      }
    )
    .addCase(fetchUserDataAsync.rejected, (state) => {
      state.data = null;
      state.isLoading = false;
    });
};

export const updateUserAsync = createAsyncThunk(
  "user/updateUserAsync",
  async (values: EditProfileValues, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.userId) throw new Error("No user logged in.");
      const userId = auth.userId;
      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }

      const newUserDetails = {
        ...values,
        address: {
          street: values.street,
          suburb: values.suburb,
          state: values.state,
          postcode: values.postcode,
        },
      };

      delete newUserDetails.honeypot;
      delete newUserDetails.suburb;
      delete newUserDetails.street;
      delete newUserDetails.state;
      delete newUserDetails.postcode;

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserDetails),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`${responseData.error}, ${responseData.errorCode}`);
      }

      return responseData;
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error updating user data:", err.message);
        throw err;
      }
    }
  }
);

const updateUserReducerBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder
    .addCase(updateUserAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      updateUserAsync.fulfilled,
      (state, action: PayloadAction<UpdateUserPayload>) => {
        const { user } = action.payload;
        state.data = user;
        state.isLoading = false;
      }
    )
    .addCase(updateUserAsync.rejected, (state) => {
      state.data = null;
      state.isLoading = false;
    });
};

export const updateUserSecurityAsync = createAsyncThunk(
  "user/updateUserSecurityAsync",
  async (values: EditLoginAndSecurityValues, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.userId) throw new Error("No user logged in.");
      const userId = auth.userId;
      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: accessToken,
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
        console.log("Error updating user data:", err.message);
        throw err;
      }
    }
  }
);

const updateUserSecurityReducerBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder
    .addCase(updateUserSecurityAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(
      updateUserSecurityAsync.fulfilled,
      (state, action: PayloadAction<UpdateUserPayload>) => {
        const { user } = action.payload;
        state.data = user;
        state.isLoading = false;
      }
    )
    .addCase(updateUserSecurityAsync.rejected, (state) => {
      state.data = null;
      state.isLoading = false;
    });
};

export const deleteUserAsync = createAsyncThunk(
  "user/deleteUserAsync",
  async (_, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState() as RootState;
      if (!auth.userId) throw new Error("No user logged in.");
      const userId = auth.userId;
      const accessToken = auth.accessToken;

      if (!accessToken) {
        throw new Error("No access token.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_HOST}/users/${userId}/delete`,
        {
          method: "DELETE",
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
        console.log("Error deleting user data:", err.message);
        throw err;
      }
    }
  }
);

const deleteUserReducerBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder
    .addCase(deleteUserAsync.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(deleteUserAsync.fulfilled, (state) => {
      state.data = null;
      state.isLoading = false;
    })
    .addCase(deleteUserAsync.rejected, (state) => {
      state.data = null;
      state.isLoading = false;
    });
};

// REDUX TK INIT

const initialState: UserState = {
  isLoading: false,
  data: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state: UserState) => {
      state.isLoading = false;
      state.data = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    fetchUserDataReducerBuilder(builder);
    updateUserReducerBuilder(builder);
    updateUserSecurityReducerBuilder(builder);
    deleteUserReducerBuilder(builder);
  },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
