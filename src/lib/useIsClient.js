import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while rendering on the server, true once running in the browser.
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}