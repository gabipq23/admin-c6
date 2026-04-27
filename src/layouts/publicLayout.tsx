import { Outlet } from "react-router-dom";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
