import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { signIn, signUp, signOut, getMe } from "../features/auth/api/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await signIn(email, password);
      setUser(data.user);
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    try {
      const data = await signUp(username, email, password);
      setUser(data.user);
    } catch (error) {
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleSignUp, handleSignOut };
};
