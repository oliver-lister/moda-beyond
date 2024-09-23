import {
  Box,
  Stack,
  TextInput,
  Button,
  Alert,
  Group,
  Title,
  PasswordInput,
} from "@mantine/core";
import { object, string } from "yup";
import { useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { SerializedError } from "@reduxjs/toolkit";
import { User } from "../../../../types/UserProps.ts";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { useUpdateUserMutation } from "../../../../state/auth/authSlice.ts";

const EditLoginAndSecuritySchema = object({
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
  honeypot: string(),
});
export interface EditLoginAndSecurityValues {
  honeypot?: string;
  email: string;
  password: string;
}

const EditLoginAndSecurityForm = ({
  user,
  toggleFormOpen,
}: {
  user: User;
  toggleFormOpen: () => void;
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [updateUser] = useUpdateUserMutation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formInitialValues: EditLoginAndSecurityValues = {
    honeypot: "",
    email: user.email,
    password: "",
  };

  const form = useForm({
    initialValues: formInitialValues,
    validate: yupResolver(EditLoginAndSecuritySchema),
  });

  const handleSubmit = async (newUserDetails: EditLoginAndSecurityValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (newUserDetails.honeypot) {
        throw new Error("Bot detected");
      }
      const response = await updateUser({
        userId: String(user._id),
        newUserDetails: newUserDetails,
      }).unwrap();

      if (response.error) throw response.error;

      form.reset();
      setIsLoading(false);
      toggleFormOpen();
      notifications.show({
        title: "Success!",
        message: "You've updated your details.",
        icon: <IconUser />,
      });
    } catch (err) {
      console.error("Error submitting form:", (err as SerializedError).message);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <Box>
        <Group justify="space-between">
          <Title order={3}>Edit Login & Security</Title>
          <Button onClick={toggleFormOpen} bg="gray.9">
            Back
          </Button>
        </Group>
      </Box>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack>
          {isError ? (
            <Alert variant="light" color="red" title="Incorrect Details">
              We could not update your details, please try again.
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
            type="email"
            label="Email Address"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="New Password"
            {...form.getInputProps("password")}
          />
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default EditLoginAndSecurityForm;
