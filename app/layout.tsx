import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Веб-ВУЗ",
  description: "Веб-приложение для управления учебным процессом",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          href="/favicon.png"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className="bg-white-100">
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
