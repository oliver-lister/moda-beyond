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
  console.log("ive been called");

  useEffect(() => {
    const refreshAccessToken = async (refreshToken: string) => {
      if (!refreshToken) return;
      await dispatch(refreshAccessTokenAsync(refreshToken)).unwrap();
    };

    // Only attempt to refresh the token if the user is not authenticated and is not loading
    if (!storedRefreshToken || auth.isAuthenticated || auth.isLoading) return;

    let isMounted = true;

    (async () => {
      try {
        await refreshAccessToken(storedRefreshToken);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          dispatch(clearUser());
        }
      }
    })();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, [storedRefreshToken, auth.isAuthenticated, auth.isLoading, dispatch]);

  return auth;
};

export default useAuth;
