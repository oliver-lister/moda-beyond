import { Menu, UnstyledButton, Box, Text, Group, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconUserCircle, IconLogout, IconLogin } from "@tabler/icons-react";
import styles from "../NavBar.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../state/store.ts";
import { signOut } from "../../../../state/auth/authSlice.ts";
import UserProps from "../../../../types/UserProps";
import { useDisclosure } from "@mantine/hooks";

const ProfileMenu = ({ user }: { user: UserProps | null }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [opened, { toggle }] = useDisclosure();

  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton className={styles.profile}>
          {user ? (
            <Box className={styles.initials}>
              <Text>
                {user.firstName[0].toUpperCase() +
                  user.lastName[0].toUpperCase()}
              </Text>
            </Box>
          ) : (
            <IconUserCircle style={{ width: rem(32), height: rem(32) }} />
          )}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {user ? (
          <>
            <Menu.Item className={styles.profile_menu_item}>
              <Link
                to="/profile"
                onClick={() => opened && toggle()}
                style={{ textDecoration: "none" }}
              >
                <Group>
                  <IconUserCircle style={{ width: rem(16), height: rem(16) }} />
                  Profile
                </Group>
              </Link>
            </Menu.Item>
            <Menu.Item className={styles.profile_menu_item}>
              <Link
                to="/"
                onClick={() => {
                  dispatch(signOut());
                }}
              >
                <Group>
                  <IconLogout style={{ width: rem(16), height: rem(16) }} />
                  Logout
                </Group>
              </Link>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item className={styles.profile_menu_item}>
            <Link to="/login">
              <Group>
                <IconLogin style={{ width: rem(16), height: rem(16) }} />
                Login
              </Group>
            </Link>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
