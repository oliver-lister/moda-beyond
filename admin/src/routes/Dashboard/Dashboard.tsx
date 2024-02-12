import { SimpleGrid, Button, Stack } from "@mantine/core";
import { IconTablePlus, IconZoomScan } from "@tabler/icons-react";
import styles from "./dashboard.module.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dashMenu = [
    {
      label: "Add Product",
      path: "/addproduct",
      left: <IconTablePlus size="2rem" />,
    },
    {
      label: "View Products",
      path: "/viewproducts",
      left: <IconZoomScan size="2rem" />,
    },
  ];

  return (
    <>
      <Stack>
        <h2>Welcome to the admin panel.</h2>
        <div className={styles.grid_box}>
          <SimpleGrid cols={{ base: 1, md: 1, lg: 2 }}>
            {dashMenu.map((link) => (
              <Button
                component={Link}
                to={link.path}
                leftSection={link.left}
                h="250px"
                fz="2rem"
              >
                {link.label}
              </Button>
            ))}
          </SimpleGrid>
        </div>
      </Stack>
    </>
  );
};

export default Dashboard;
