import Signup, { SignupValues } from "./components/Signup.tsx";
import Login, { LoginValues } from "./components/Login.tsx";
import { Box, Center } from "@mantine/core";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { loginAsync, signupAsync } from "../../state/auth/authSlice.ts";
import { SerializedError } from "@reduxjs/toolkit";

const LoginSignup = ({ type }: { type: string }) => {
  const dispatch = useDispatch<AppDispatch>();

  const dispatchValues = async (values: LoginValues | SignupValues) => {
    if (type === "login") {
      try {
        await dispatch(loginAsync(values as LoginValues)).unwrap();
      } catch (err) {
        console.log("Error submitting form:", (err as SerializedError).message);
        throw err;
      }
    } else if (type === "signup") {
      try {
        await dispatch(signupAsync(values as SignupValues)).unwrap();
      } catch (err) {
        console.log("Error submitting form:", (err as SerializedError).message);
        throw err;
      }
    }
  };

  return (
    <section>
      <Center mih="60vh" bg="violet.1">
        <Box maw="700px" p="2rem" bg="white">
          {type === "login" ? (
            <Login dispatchValues={dispatchValues} />
          ) : (
            <Signup dispatchValues={dispatchValues} />
          )}
        </Box>
      </Center>
    </section>
  );
};

export default LoginSignup;
