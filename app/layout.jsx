import "./globals.css";

export const metadata = {
  title: "Scroll Car Animation",
  description:
    "A scroll-driven car animation built with Next.js, React, Tailwind CSS, GSAP and ScrollTrigger.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
