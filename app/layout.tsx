import "./globals.css";

export const metadata = {
  title: "CharanStoryCuts",
  description: "Professional videography & editing",
  google:"ir9ByAvwgyeerwKR_bhtg3YuQY0_4NYJjLxSx_nVu7o"
};

import "./globals.css";
import { LoadingProvider } from "@/app/components/LoadingProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}

