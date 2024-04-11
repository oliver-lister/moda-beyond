import { Stack } from "@mantine/core";
import AccountPage from "../components/AccountPage";
import InfoCard from "../components/InfoCard/InfoCard";

const LoginAndSecurity = () => {
  return (
    <AccountPage title="Login & Security">
      <InfoCard bg_circle={false}>
        <Stack></Stack>
      </InfoCard>
    </AccountPage>
  );
};

export default LoginAndSecurity;
