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
import { IconCake, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { object, string, boolean } from "yup";
import { useRef, useState } from "react";
import { SerializedError } from "@reduxjs/toolkit";
import { CartItem } from "../../../types/UserProps.ts";

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
  cart?: CartItem[] | null;
}

const Signup = ({
  dispatchValues,
}: {
  dispatchValues: (values: SignupValues) => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const initialFormValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: new Date(),
    shoppingPreference: "Womenswear",
    newsletter: true,
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: yupResolver(signupSchema),
  });

  const handleSignupSubmit = async (values: SignupValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (honeypotRef.current && honeypotRef.current.value !== "") {
        throw new Error("Bot detected");
      }

      // if localStorage cart exists append this to the values object and pass to new user
      const localCart = localStorage.getItem("cart");
      if (localCart) values.cart = JSON.parse(localCart);

      await dispatchValues(values);
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
    <form onSubmit={form.onSubmit(handleSignupSubmit)}>
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
          data-testid="honeypot"
          ref={honeypotRef}
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
        <Button type="submit" loading={isLoading} data-testid="signup-button">
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
