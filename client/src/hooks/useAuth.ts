import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signIn, signUp, signOut } from "../features/auth/api/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await signIn(email, password);
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
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
      return data.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleSignIn, handleSignUp, handleSignOut };
};
