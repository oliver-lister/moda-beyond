import { useEffect } from "react";
import { fetchUserDataAsync } from "../state/user/userSlice";
import { AuthState } from "../state/auth/authSlice";
import { AppDispatch, RootState } from "../state/store";
import { shallowEqual, useSelector } from "react-redux";

// Custom hook for managing user data logic
const useUserSync = (auth: AuthState, dispatch: AppDispatch) => {
  const user = useSelector((state: RootState) => state.user, {
    equalityFn: shallowEqual,
  });

  useEffect(() => {
    if (auth.userId) {
      dispatch(fetchUserDataAsync());
    }
  }, [auth.userId, dispatch]);

  return user;
};

export default useUserSync;
