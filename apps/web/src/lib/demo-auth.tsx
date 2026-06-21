"use client";
import { createContext, useContext, ReactNode } from "react";
import { DEMO_USER } from "./demo-data";

const DemoAuthContext = createContext({ user: DEMO_USER, isLoaded: true, isSignedIn: true });

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  return (
    <DemoAuthContext.Provider value={{ user: DEMO_USER, isLoaded: true, isSignedIn: true }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export const useDemoAuth = () => useContext(DemoAuthContext);
