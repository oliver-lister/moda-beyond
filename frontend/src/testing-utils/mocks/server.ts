import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Set up mock service worker server with handlers
export const server = setupServer(...handlers);
