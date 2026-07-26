import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import AppLayoutWrapper from "./components/AppLayoutWrapper";

export const metadata = {
  title: "StockPulse | Advanced Market Insights & AI Analysis",
  description: "Analyze, predict, and tracks stocks using high-performance indicators and AI insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
