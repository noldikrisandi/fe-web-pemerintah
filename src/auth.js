import { apiRequest } from "./api";

export const login = async (email, password) => {
  try {
    const data = await apiRequest("login", "POST", { email, password });
    localStorage.setItem("token", data.token); // simpan token di localStorage
    return data;
  } catch (error) {
    throw error;
  }
};
