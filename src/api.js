const API_BASE_URL = "https://api-web-pemerintah-production.up.railway.app/";

export const apiRequest = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Terjadi kesalahan pada server");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
