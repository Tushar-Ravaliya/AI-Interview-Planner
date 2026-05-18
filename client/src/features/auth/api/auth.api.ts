import api from "../../../services/apiClient.ts";

export const signUp = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post(`/auth/signup`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const response = await api.post(`/auth/signin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await api.post(`/auth/signout`, {});
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get(`/auth/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
