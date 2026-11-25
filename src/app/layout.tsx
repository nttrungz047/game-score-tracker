import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Write Score",
  description: "A local-first game score tracker",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
