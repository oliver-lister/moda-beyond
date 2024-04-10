import Signup from "./components/Signup.tsx";
import Login from "./components/Login.tsx";
import { Box, Center } from "@mantine/core";

const LoginSignup = ({ type }: { type: string }) => {
  return (
    <section>
      <Center mih="60vh" bg="violet.1">
        <Box maw="700px" p="2rem" bg="white">
          {type === "login" ? <Login /> : <Signup />}
        </Box>
      </Center>
    </section>
  );
};

export default LoginSignup;
