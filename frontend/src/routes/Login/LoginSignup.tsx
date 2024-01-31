import {
  PasswordInput,
  TextInput,
  Stack,
  Select,
  Checkbox,
  Button,
  Anchor,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import styles from "./login.module.css";
import { IconCake, IconLock } from "@tabler/icons-react";
import { useState } from "react";

const Signup = () => {
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      birthday: "",
      shoppingPreference: "Womenswear",
      newsletter: true,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
          ? null
          : "Password must be at least 8 characters, with one letter and one number",
      firstName: (value) => (value ? null : "First name is required"),
      lastName: (value) => (value ? null : "Last name is required"),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <div>
          <h2 className={styles.heading}>Sign Up</h2>
          <p>
            Create an account to make purchases, and save your details for next
            time!
          </p>
        </div>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          label="Password"
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
          {...form.getInputProps("birthday")}
        />
        <Select
          withAsterisk
          label="Shopping Preference"
          data={["Womenswear", "Menswear"]}
          {...form.getInputProps("shoppingPreference")}
        />
        <Checkbox
          label="Sign up for THE SHOPPER news and get a $20 voucher for your next purchase. You'll receive sales alerts, exclusive offers and the latest on styles & trends."
          {...form.getInputProps("newsletter")}
        />
        <Button type="submit">Create My Account</Button>
      </Stack>
    </form>
  );
};

const Login = () => {
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      birthday: "",
      shoppingPreference: "Womenswear",
      newsletter: true,
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email.",
      password: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
          ? null
          : "Please enter a valid password.",
    },
  });
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack>
        <div>
          <h2 className={styles.heading}>Login</h2>
          <p>Login to purchase products, and review your details!</p>
        </div>
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput label="Password" {...form.getInputProps("password")} />
        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
};

const LoginSignup = () => {
  const [mode, setMode] = useState("login");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "signup" ? "login" : "signup"));
  };
  return (
    <section className={styles.loginsignup}>
      <div className={styles.wrapper}>
        <div className={styles.form}>
          <Stack>
            {mode === "login" ? <Login /> : <Signup />}
            <Anchor onClick={toggleMode}>
              {mode === "login"
                ? "Don't have an account? Click here to sign up."
                : "Already have an account? Click here to login."}
            </Anchor>
          </Stack>
        </div>
      </div>
    </section>
  );
};

export default LoginSignup;
