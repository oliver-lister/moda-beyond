import {
  Group,
  SimpleGrid,
  Stack,
  Container,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import styles from "./Footer.module.css";

const Footer = () => {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  return (
    <>
      <div className={styles.footer}>
        <Container size="xl">
          <SimpleGrid cols={4}>
            <Stack gap="sm" className={styles.newsletter}>
              <h4>Stay in touch</h4>
              <p>
                Sign up to our newsletter for your <span>$20 voucher.*</span>
              </p>
              <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="your@email.com"
                  {...form.getInputProps("email")}
                  className={styles.newsletter_input}
                />
                <Group justify="flex-end" mt="md">
                  <Button type="submit">Submit</Button>
                </Group>
              </form>
            </Stack>
          </SimpleGrid>
        </Container>
      </div>
    </>
  );
};

export default Footer;
