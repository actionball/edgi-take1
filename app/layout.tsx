import "./globals.css";
import Wrapper from "@/components/Wrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Edgi",
  description: "Edgi Take 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <link
          href="https://fonts.googleapis.com/css2?family=Amaranth&family=Work+Sans&family=Work+Sans:wght@700&display=swap"
          rel="stylesheet"
        />
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
