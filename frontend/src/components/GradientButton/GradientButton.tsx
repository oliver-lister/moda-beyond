import { Button } from "@mantine/core";
import styles from "./gradientButton.module.css";
import React from "react";

const GradientButton = ({
  children,
  onClick,
  type,
  ...rest
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <Button
      variant="gradient"
      gradient={{ from: "grape", to: "violet", deg: 90 }}
      className={styles.button}
      onClick={onClick ? onClick : undefined}
      type={type || "button"}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
