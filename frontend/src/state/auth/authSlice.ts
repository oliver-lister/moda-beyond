import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { User } from "../../types/UserProps";
import { RootState } from "../store";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UserResponse {
  user: User;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addMatcher(
        authApi.endpoints.getSession.matchFulfilled,
        (state, action) => {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        authApi.endpoints.getSession.matchRejected,
        () => initialState
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

// RTK Query for managing auth API calls
export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getSession: build.query<AuthState, void>({
      query: () => ({
        url: `/auth/session`,
        credentials: "include",
      }),
      providesTags: ["Auth"],
    }),
    getUser: build.query<UserResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: `/user/${userId}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    login: build.mutation({
      query: (loginDetails) => ({
        url: "/auth/login",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: build.mutation({
      query: (signUpDetails) => ({
        url: "/auth/signup",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpDetails),
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useSignupMutation,
  useGetSessionQuery,
  useLogoutMutation,
} = authApi;
