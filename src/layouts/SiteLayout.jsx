import { Outlet } from "react-router-dom";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import { useServerStatus } from "../context/ServerStatusContext";
import ServerDown from "../components/agency/ServerDown";

export default function SiteLayout() {
  const { isServerDown } = useServerStatus();

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
