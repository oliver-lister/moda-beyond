import {
  Group,
  Grid,
  Stack,
  Container,
  TextInput,
  Button,
  GridCol,
  Text,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import styles from "./footer.module.css";
import { Link } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandYoutube,
  IconMail,
} from "@tabler/icons-react";

const navMenu = [
  {
    label: "Women",
    path: "/shop?category=women&page=1&sortBy=date&sortOrder=-1",
  },
  {
    label: "Men",
    path: "/shop?category=men&page=1&sortBy=date&sortOrder=-1",
  },
  {
    label: "Kids",
    path: "/shop?category=kids&page=1&sortBy=date&sortOrder=-1",
  },
  { label: "Cart", path: "/cart" },
  { label: "Login / Signup", path: "/login" },
];

const socials = [
  {
    label: "Facebook",
    path: "https://www.facebook.com/",
    icon: <IconBrandFacebook size={15} />,
  },
  {
    label: "Twitter",
    path: "https://www.twitter.com/",
    icon: <IconBrandTwitter size={15} />,
  },
  {
    label: "Instagram",
    path: "https://www.instagram.com/",
    icon: <IconBrandInstagram size={15} />,
  },
  {
    label: "Pinterest",
    path: "https://www.pinterest.com/",
    icon: <IconBrandPinterest size={15} />,
  },
  {
    label: "Youtube",
    path: "https://www.youtube.com/",
    icon: <IconBrandYoutube size={15} />,
  },
];

const Footer = () => {
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = () => {
    notifications.show({
      title: "Thanks for signing up!",
      message: " We'll be in-touch with our latest offers and news.",
      icon: <IconMail />,
    });
    form.reset();
  };

  return (
    <>
      <Box className={styles.footer}>
        <Container size="xl">
          <Grid gutter="xl">
            <GridCol span={{ base: 6, md: 4 }} order={{ base: 2, md: 1 }}>
              <Stack gap="sm" className={styles.nav}>
                <Text fw={600}>MØDA-BEYOND</Text>
                <nav>
                  <ul className={styles.list}>
                    {navMenu.map((link, index) => (
                      <li key={index} className={styles.list_item}>
                        <Link to={link.path} className={styles.link}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 6, md: 4 }} order={{ base: 3, md: 2 }}>
              <Stack gap="sm" className={styles.socials}>
                <Text fw={600}>FOLLOW US</Text>
                <nav>
                  <ul className={styles.list}>
                    {socials.map((link, index) => (
                      <li key={index} className={styles.list_item}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={link.path}
                          className={styles.link}
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Stack>
            </GridCol>
            <GridCol span={{ base: 12, md: 4 }} order={{ base: 1, md: 3 }}>
              <Stack gap="sm">
                <Text fw={600}>STAY IN TOUCH</Text>
                <Text opacity={0.8}>
                  Sign up to our newsletter for your $20 voucher.*
                </Text>
                <form onSubmit={form.onSubmit(() => handleSubmit())}>
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
            </GridCol>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
