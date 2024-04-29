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
import UserProps from "../../../../types/UserProps.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { updateUserAsync } from "../../../../state/user/userSlice.ts";
import { notifications } from "@mantine/notifications";
import { IconUser } from "@tabler/icons-react";

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
  user: UserProps;
  toggleFormOpen: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      await dispatch(updateUserAsync(values));
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
            placeholder="do not fill this"
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
                label="Sign up for MØDA-BEYOND news and get a $20 voucher for your next purchase. You'll receive sales alerts, exclusive offers and the latest on styles & trends."
                {...form.getInputProps("newsletter")}
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
