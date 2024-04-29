import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState();

  useEffect(() => {
    const getSession = async (sessionId: string) => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_HOST
          }/checkout/get-session/${sessionId}`,
          {
            method: "GET",
          }
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`${responseData.error}, ${responseData.errorCode}`);
        }
        const { session } = responseData;
        return session;
      } catch (err) {
        if (err instanceof Error) {
          console.log("Error: " + err.message);
        }
      }
    };
    const fetchData = async () => {
      if (!sessionId) return;
      const checkoutSession = await getSession(sessionId);
      console.log(checkoutSession);
      setSession(checkoutSession);
    };

    fetchData();
  }, [sessionId]);

  if (session.status === "open") {
    return <p>Payment did not work.</p>;
  }

  if (session.status === "complete") {
    return (
      <h3>
        We appreciate your business! Your Stripe customer ID is:
        {session.customer as string}.
      </h3>
    );
  }

  return null;
};

export default CheckoutReturn;
