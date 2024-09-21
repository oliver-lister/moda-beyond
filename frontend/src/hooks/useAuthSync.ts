import { useEffect } from "react";
import { refreshAccessTokenAsync } from "../state/auth/authSlice";
import { clearUser } from "../state/user/userSlice";
import { shallowEqual, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../state/store";

// Custom hook for syncing authentication
const useAuth = (dispatch: AppDispatch, storedRefreshToken: string | null) => {
  const auth = useSelector((state: RootState) => state.auth, {
    equalityFn: shallowEqual,
  });

  useEffect(() => {
    const refreshAccessToken = async (refreshToken: string) => {
      if (!refreshToken) return;
      await dispatch(refreshAccessTokenAsync(refreshToken));
    };

    if (!storedRefreshToken || auth.isAuthenticated || auth.isLoading) return;

    try {
      refreshAccessToken(storedRefreshToken);
    } catch (err) {
      console.error(err);
      dispatch(clearUser());
    }
  }, [auth.isAuthenticated, auth.isLoading, storedRefreshToken, dispatch]);

  return auth;
};

export default useAuth;
