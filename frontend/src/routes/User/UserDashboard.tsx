import { Card, Container, SimpleGrid, Title, Text } from "@mantine/core";

const UserDashboardCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card bg="black" c="white">
      <Title order={3}>{title}</Title>
      <Text>{children}</Text>
    </Card>
  );
};

const UserDashboard = () => {
  return (
    <section>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
          <UserDashboardCard title="Cart">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            tempora!
          </UserDashboardCard>
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default UserDashboard;
