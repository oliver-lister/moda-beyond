// More convenient to export all @testing-library/* functions that you are planning to use from ./testing-utils/index.ts file:

import userEvent from "@testing-library/user-event";

export * from "@testing-library/react";
export { render } from "./render";
export { userEvent };
