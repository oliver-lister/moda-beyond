import {
  Box,
  Stack,
  TextInput,
  Button,
  Alert,
  Select,
  Checkbox,
  Fieldset,
  Group,
  Title,
  NativeSelect,
} from "@mantine/core";
import { object, string, date, boolean } from "yup";
import { useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { SerializedError } from "@reduxjs/toolkit";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";
import { User } from "../../../../types/UserProps.ts";
import { useUpdateUserMutation } from "../../../../state/auth/authSlice.ts";

const editProfileSchema = object({
  honeypot: string(),
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  dob: date(),
  street: string(),
  suburb: string(),
  state: string(),
  postcode: string(),
  shoppingPreference: string()
    .required("Shopping preference is required")
    .oneOf(
      ["Womenswear", "Menswear"],
      "Shopping preference must be Womenswear or Menswear"
    ),
  newsletter: boolean(),
});

export interface EditProfileValues {
  honeypot?: string;
  firstName: string;
  lastName: string;
  dob: Date;
  street?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  shoppingPreference: string;
  newsletter: boolean;
}

const EditProfileForm = ({
  user,
  toggleFormOpen,
}: {
  user: User;
  toggleFormOpen: () => void;
}) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updateUser] = useUpdateUserMutation();

  const formInitialValues: EditProfileValues = user
    ? {
        honeypot: "",
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob ? new Date(user.dob) : new Date(),
        street: user.address ? user.address.street : "",
        suburb: user.address ? user.address.suburb : "",
        state: user.address ? user.address.state : "",
        postcode: user.address ? user.address.postcode : "",
        shoppingPreference: user.shoppingPreference,
        newsletter: user.newsletter,
      }
    : {
        honeypot: "",
        firstName: "",
        lastName: "",
        dob: new Date(),
        street: "",
        suburb: "",
        state: "",
        postcode: "",
        shoppingPreference: "Womenswear",
        newsletter: false,
      };

  const form = useForm({
    initialValues: formInitialValues,
    validate: yupResolver(editProfileSchema),
  });

  const handleSubmit = async (values: EditProfileValues) => {
    try {
      setIsLoading(true);
      setIsError(false);
      if (form.values.honeypot) {
        throw new Error("Bot detected");
      }
      const response = await updateUser({
        userId: String(user._id),
        newUserDetails: values,
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
      console.log("Error submitting form:", (err as SerializedError).message);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <Box>
        <Group justify="space-between">
          <Title order={3}>Edit Profile</Title>
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
            placeholder="Do not fill this in"
            type="hidden"
            {...form.getInputProps("honeypot")}
          />
          <Fieldset legend="User Information">
            <TextInput
              label="First Name"
              {...form.getInputProps("firstName")}
            />
            <TextInput label="Last Name" {...form.getInputProps("lastName")} />
            <DateInput
              label="Birthday"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps("dob")}
            />
          </Fieldset>
          <Fieldset legend="Address">
            <TextInput label="Street" {...form.getInputProps("street")} />
            <TextInput label="Suburb" {...form.getInputProps("suburb")} />
            <NativeSelect
              label="State"
              data={["NSW", "VIC", "QLD", "SA", "WA", "NT", "ACT"]}
              {...form.getInputProps("state")}
            />
            <TextInput label="Postcode" {...form.getInputProps("postcode")} />
          </Fieldset>
          <Fieldset legend="Preferences">
            <Stack>
              <Select
                withAsterisk
                label="Shopping Preference"
                data={["Womenswear", "Menswear"]}
                {...form.getInputProps("shoppingPreference")}
              />
              <Checkbox
                id="newsletter"
                name="newsletter"
                label="Sign up for MØDA-BEYOND news and get a $20 voucher for your next purchase. You'll receive sales alerts, exclusive offers and the latest on styles & trends."
                checked={form.values.newsletter}
                onChange={(event) =>
                  form.setFieldValue("newsletter", event.currentTarget.checked)
                }
              />
            </Stack>
          </Fieldset>
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default EditProfileForm;
