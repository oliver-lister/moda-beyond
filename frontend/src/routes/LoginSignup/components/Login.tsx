import {
  PasswordInput,
  TextInput,
  Stack,
  Alert,
  Box,
  Title,
  Text,
  Anchor,
  Button,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { SerializedError } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../state/store.ts";
import { loginAsync } from "../../../state/auth/authSlice.ts";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";

const loginSchema = object({
  email: string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Please enter a valid password"
    ),
});

export interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: yupResolver(loginSchema),
  });

  const handleSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      await dispatch(loginAsync(values)).unwrap();
      form.reset();
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      console.log("Error submitting form:", (err as SerializedError).message);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack>
        <Box>
          <Title order={1}>Login</Title>
          <Text>Login to purchase products, and review your details!</Text>
        </Box>
        {isError ? (
          <Alert variant="light" color="red" title="Incorrect Details">
            Your username or password was incorrect, please try again.
          </Alert>
        ) : null}
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          {...form.getInputProps("password")}
        />
        <Button type="submit" loading={isLoading}>
          Login
        </Button>
        <Anchor onClick={() => navigate("/signup")}>
          Don't have an account? Click here to sign up.
        </Anchor>
      </Stack>
    </form>
  );
};

export default Login;
