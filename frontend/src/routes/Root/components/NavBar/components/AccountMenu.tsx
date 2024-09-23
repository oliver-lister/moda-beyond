import { Group, Menu, UnstyledButton, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconUserCircle,
  IconLogout,
  IconKey,
  IconShoppingCart,
  IconLogin,
} from "@tabler/icons-react";
import { useLogoutMutation } from "../../../../../state/auth/authSlice.ts";
import InitialsAvatar from "../../../../../components/InitialsAvatar/InitialsAvatar.tsx";
import { User } from "../../../../../types/UserProps.ts";

const accountMenuLinks = [
  {
    label: "Profile",
    icon: <IconUserCircle style={{ width: rem(16), height: rem(16) }} />,
    path: "/account/profile",
  },
  {
    label: "Login & Security",
    icon: <IconKey style={{ width: rem(16), height: rem(16) }} />,
    path: "/account/login-and-security",
  },
  {
    label: "Cart",
    icon: <IconShoppingCart style={{ width: rem(16), height: rem(16) }} />,
    path: "/cart",
  },
];

const AccountMenu = ({ user }: { user: User }) => {
  const [logout] = useLogoutMutation();

  const handleLogout = () => {
    logout({});
  };

  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton aria-label="Click to reveal account menu options">
          <InitialsAvatar
            firstNameLetter={user.firstName[0]}
            lastNameLetter={user.lastName[0]}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <>
          {user ? (
            <>
              <Menu.Label>{user.firstName + " " + user.lastName}</Menu.Label>
              {accountMenuLinks.map((link, index) => (
                <Menu.Item
                  key={index}
                  component={Link}
                  to={link.path}
                  leftSection={link.icon}
                >
                  {link.label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Item
                component={Link}
                to="/"
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} />
                }
                onClick={handleLogout}
                c="red"
              >
                Logout
              </Menu.Item>
            </>
          ) : (
            <Menu.Item component={Link} to="/login">
              <Group>
                <IconLogin style={{ width: rem(16), height: rem(16) }} />
                Login
              </Group>
            </Menu.Item>
          )}
        </>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AccountMenu;
