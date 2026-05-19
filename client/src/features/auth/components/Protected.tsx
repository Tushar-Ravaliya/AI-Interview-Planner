import { useAuth } from "../../../hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import Loader from "./Loader";

export default function Protected() {
  const { user, loading } = useAuth();
  if (loading) {
    return <Loader />;
  }
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
}
