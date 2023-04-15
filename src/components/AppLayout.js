import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </div>
  );
}