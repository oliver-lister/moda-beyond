import { Grid, Stack, Container, GridCol } from "@mantine/core";
import styles from "./footer.module.css";
import { Link } from "react-router-dom";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandYoutube,
} from "@tabler/icons-react";

const Footer = () => {
  const navMenu = [
    { label: "Women", path: "/women" },
    { label: "Men", path: "/men" },
    { label: "Kids", path: "/kids" },
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

  return (
    <>
      <div className={styles.footer}>
        <Container size="xl">
          <Grid gutter="xl">
            <GridCol span={{ base: 6, md: 4 }} order={{ base: 2, md: 1 }}>
              <Stack gap="sm" className={styles.nav}>
                <h4 className={styles.heading}>The Shopper</h4>
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
                <h4 className={styles.heading}>Follow Us</h4>
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
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default Footer;
