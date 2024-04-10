import {
  PasswordInput,
  TextInput,
  Stack,
  Select,
  Checkbox,
  Box,
  Title,
  Text,
  Anchor,
  Button,
  Alert,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import { IconCake, IconLock } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { SerializedError } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../state/store.ts";
import { signupAsync } from "../../../state/auth/authSlice.ts";
import { useNavigate } from "react-router-dom";
import { object, string, boolean } from "yup";

const signupSchema = object().shape({
  email: string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  dob: string(),
  newsletter: boolean(),
  shoppingPreference: string(),
  honeypot: string(),
});

export interface SignupValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: Date;
  newsletter: boolean;
  shoppingPreference: string;
  honeypot?: string;
}

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dob: new Date(),
      shoppingPreference: "Womenswear",
      newsletter: true,
      honeypot: "",
    },

    validate: yupResolver(signupSchema),
  });

  const handleSubmit = async (values: SignupValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (form.values.honeypot) {
        throw new Error("Bot detected");
      }
      delete values.honeypot;
      await dispatch(signupAsync(values)).unwrap();
      form.reset();
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      console.log("Error submitting form:", (err as SerializedError).message);
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack>
        <Box>
          <Title order={1}>Sign Up</Title>
          <Text>
            Create an account to make purchases, and save your details for next
            time!
          </Text>
        </Box>
        {isError ? (
          <Alert variant="light" color="red" title="Error">
            Please try again.
          </Alert>
        ) : null}
        {/* Honeypot below */}
        <input
          name="honeypot"
          placeholder="do not fill this"
          type="hidden"
          {...form.getInputProps("honeypot")}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="•••••••"
          leftSection={<IconLock size={15} />}
          {...form.getInputProps("password")}
        />
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="John"
          {...form.getInputProps("firstName")}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="Smith"
          {...form.getInputProps("lastName")}
        />
        <DateInput
          leftSection={<IconCake size={15} />}
          label="Birthday"
          placeholder="Select date"
          valueFormat="DD/MM/YYYY"
          {...form.getInputProps("dob")}
        />
        <Select
          withAsterisk
          label="Shopping Preference"
          data={["Womenswear", "Menswear"]}
          {...form.getInputProps("shoppingPreference")}
        />
        <Checkbox
          label="Sign up for MØDA-BEYOND news and get a $20 voucher for your next purchase. You'll receive sales alerts, exclusive offers and the latest on styles & trends."
          {...form.getInputProps("newsletter")}
        />
        <Button type="submit" loading={isLoading}>
          Create My Account
        </Button>
        <Anchor onClick={() => navigate("/login")}>
          Already have an account? Click here to login.
        </Anchor>
      </Stack>
    </form>
  );
};

export default Signup;
