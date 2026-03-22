import "./globals.css";

export const metadata = {
  title: "CharanStoryCuts| Automotive Videography in Hyderabad",
  keywords: [
    "bike videography Hyderabad",
    "car videography Hyderabad",
    "automobile videography India",
    "bike cinematic shoot",
    "car reels videography",
    "motorcycle videography",
  ],
  description: "CharanStoryCuts offers professional Automotive videography in Hyderabad. Book cinematic shoots, reels, and automobile storytelling services.",
  google:"ir9ByAvwgyeerwKR_bhtg3YuQY0_4NYJjLxSx_nVu7o",
  icons : {
    icon: "app/icon.png",
  },
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

