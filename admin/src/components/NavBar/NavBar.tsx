import { Link, useLocation } from "react-router-dom";
import { List, NavLink } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconTablePlus,
  IconZoomScan,
  IconEdit,
  IconBackspace,
} from "@tabler/icons-react";

const NavBar = ({ toggle }: { toggle: () => void }) => {
  const { pathname } = useLocation();

  const navMenu = [
    { label: "Dashboard", path: "/", left: <IconLayoutDashboard /> },
    { label: "View Products", path: "/viewproducts", left: <IconZoomScan /> },
    { label: "Add Product", path: "/addproduct", left: <IconTablePlus /> },
    { label: "Edit Product", path: "/editproduct", left: <IconEdit /> },
    {
      label: "Clear Sessions",
      path: "/clearsessions",
      left: <IconBackspace />,
    },
  ];

  return (
    <nav>
      <List type="unordered" listStyleType="none" spacing={10}>
        {navMenu.map((link, index) => (
          <List.Item
            key={index}
            styles={{
              itemWrapper: { display: "flex" },
              itemLabel: { width: "100%" },
            }}
          >
            <NavLink
              component={Link}
              to={link.path}
              leftSection={link.left}
              label={link.label}
              variant="filled"
              active={pathname === link.path}
              onClick={toggle}
              styles={{
                root: { borderRadius: "5px" },
                label: { fontSize: "1.5rem" },
              }}
            />
          </List.Item>
        ))}
      </List>
    </nav>
  );
};

export default NavBar;
