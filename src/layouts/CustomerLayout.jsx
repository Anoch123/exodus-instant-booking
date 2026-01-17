import { Outlet } from "react-router-dom";
import { useServerStatus } from "../context/ServerStatusContext";
import ServerDown from "../components/agency/ServerDown";

export default function CustomerLayout() {
  const { isServerDown } = useServerStatus();

  if (isServerDown) {
    return <ServerDown />;
  }

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
