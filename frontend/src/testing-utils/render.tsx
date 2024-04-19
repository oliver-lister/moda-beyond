import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";

// Mantine
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme.ts";
import { MemoryRouter } from "react-router-dom";

// Redux TK
import { Provider } from "react-redux";
import type { AppStore, RootState } from "../state/store.ts";
import { setupStore } from "../state/store.ts";

// As a basic setup, import your same slice reducers

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <MemoryRouter>
      <Provider store={store}>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </Provider>
    </MemoryRouter>
  );

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
