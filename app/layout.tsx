import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "lundyscript",
  description: "Hello World! I'm Lundy, a remote software developer doing web dev things based in Jember, Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />\
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" type="image/<generated>" sizes="<generated>" />
      </head>
      <body className={firaCode.variable}>
        {children}
      </body>
    </html>
  );
}
