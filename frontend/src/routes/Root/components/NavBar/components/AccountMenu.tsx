import { Menu, UnstyledButton, Group, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconUserCircle,
  IconLogout,
  IconLogin,
  IconKey,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../state/store.ts";
import { AuthState, signOut } from "../../../../../state/auth/authSlice.ts";
import InitialsAvatar from "../../../../../components/InitialsAvatar/InitialsAvatar.tsx";
import UserProps from "../../../../../types/UserProps.ts";
import { clearUser } from "../../../../../state/user/userSlice.ts";

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

const AccountMenu = ({ auth, user }: { auth: AuthState; user: UserProps }) => {
  const dispatch = useDispatch<AppDispatch>();

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
        {auth.isAuthenticated ? (
          <>
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
              onClick={() => {
                dispatch(signOut());
                dispatch(clearUser());
              }}
              c="red"
            >
              Logout
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>
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

export default AccountMenu;
