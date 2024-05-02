import {
  SimpleGrid,
  Button,
  Stack,
  Title,
  Box,
  Container,
} from "@mantine/core";
import {
  IconTablePlus,
  IconZoomScan,
  IconEdit,
  IconBackspace,
} from "@tabler/icons-react";
import styles from "./dashboard.module.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dashMenu = [
    {
      label: "View Products",
      path: "/viewproducts",
      left: <IconZoomScan />,
    },
    {
      label: "Add Product",
      path: "/addproduct",
      left: <IconTablePlus />,
    },
    {
      label: "Edit Product",
      path: "/editproduct",
      left: <IconEdit />,
    },
    {
      label: "Clear Sessions",
      path: "/clearsessions",
      left: <IconBackspace />,
    },
  ];

  return (
    <>
      <Stack>
        <Title order={1}>Dashboard</Title>

        <Box className={styles.grid_box}>
          <Container size="xl">
            <SimpleGrid cols={{ base: 1, md: 1, lg: 2, xl: 4 }}>
              {dashMenu.map((link, index) => (
                <Button
                  component={Link}
                  to={link.path}
                  leftSection={link.left}
                  h={100}
                  radius="0.5rem"
                  key={index}
                >
                  {link.label}
                </Button>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Stack>
    </>
  );
};

export default Dashboard;
