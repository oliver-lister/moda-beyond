import { Button, Modal, Text } from "@mantine/core";
import { useEffect, useState } from "react";

// Modal component for displaying backend spin-up information

const BackendInfoModal = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  // State to manage the modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // Show modal if user is not signed in and modal hasn't been shown before
    const hasSeenModal = localStorage.getItem("hasSeenModal");
    if (!isAuthenticated && !hasSeenModal) {
      setShowModal(true);
      localStorage.setItem("hasSeenModal", "true");
    }
  }, [isAuthenticated]);

  return (
    <Modal
      opened={showModal}
      onClose={() => setShowModal(false)}
      title="Backend Information"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Text>
        The backend is hosted on Render.com, which has a 1-minute spin-up time
        before database data will load. Please wait a moment for the data to
        appear.
      </Text>
      <Button onClick={() => setShowModal(false)} fullWidth mt="md">
        Close
      </Button>
    </Modal>
  );
};

export default BackendInfoModal;
