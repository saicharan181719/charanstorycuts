import "./globals.css";

export const metadata = {
  title: "Charan Story Cuts",
  description: "Professional videography & editing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
