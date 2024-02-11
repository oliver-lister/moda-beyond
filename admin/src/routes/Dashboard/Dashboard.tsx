import { SimpleGrid, Button, Stack } from "@mantine/core";
import { IconTablePlus, IconZoomScan } from "@tabler/icons-react";
import styles from "./dashboard.module.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navMenu = [
    { label: "Add Product", path: "/addproduct", left: <IconTablePlus /> },
    { label: "View Products", path: "/viewproducts", left: <IconZoomScan /> },
  ];

  return (
    <>
      <Stack>
        <h2>Welcome to the admin panel.</h2>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {navMenu.map((link) => (
            <Button component={Link} to={link.path} leftSection={link.left}>
              {link.label}
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default Dashboard;
