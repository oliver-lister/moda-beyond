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
import { useNavigate } from "react-router-dom";
import { useForm, yupResolver } from "@mantine/form";
import { object, string } from "yup";
import { useRef, useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";

export interface LoginValues {
  email: string;
  password: string;
}

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

const Login = ({
  dispatchValues,
}: {
  dispatchValues: (values: LoginValues) => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const initialFormValues = {
    email: "",
    password: "",
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: yupResolver(loginSchema),
  });

  const handleLoginSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (honeypotRef.current && honeypotRef.current.value !== "") {
        throw new Error("Bot detected");
      }
      await dispatchValues(values);
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
    <form onSubmit={form.onSubmit(handleLoginSubmit)}>
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
        {/* Honeypot below */}
        <input
          name="honeypot"
          placeholder="do not fill this"
          type="hidden"
          data-testid="honeypot"
          ref={honeypotRef}
        />
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
        <Button type="submit" loading={isLoading} data-testid="login-button">
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
