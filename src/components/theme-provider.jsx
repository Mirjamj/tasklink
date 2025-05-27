"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Wraps children with the Next.js theme provider, forwarding all props.
export function ThemeProvider({
  children,
  ...props
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
