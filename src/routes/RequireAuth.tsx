import { Navigate, Outlet } from "react-router-dom";

import { IUser } from "@/interfaces/login";

type RequireAuthProps = {
  user: IUser | null;
};

export default function RequireAuth({ user }: RequireAuthProps) {
  if (!user) return <Navigate to="/admin" replace />;

  return <Outlet />;
}
