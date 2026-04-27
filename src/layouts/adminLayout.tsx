import { Outlet } from "react-router-dom";

import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import SubHeader from "../components/subHeader";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <SubHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
