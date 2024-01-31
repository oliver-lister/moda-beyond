import {
  PasswordInput,
  TextInput,
  Stack,
  Select,
  Checkbox,
  Button,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import styles from "./login.module.css";
import { IconCake, IconLock } from "@tabler/icons-react";

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
    <section className={styles.loginsignup}>
      <div className={styles.wrapper}>
        <form
          className={styles.form}
          onSubmit={form.onSubmit((values) => console.log(values))}
        >
          <Stack>
            <div>
              <h2 className={styles.heading}>Sign Up</h2>
              <p>
                Create an account to make purchases, and save your details for
                next time!
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
      </div>
    </section>
  );
};

export default Login;
