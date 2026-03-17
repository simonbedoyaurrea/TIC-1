const API_URL = "http://localhost:8080/api/auth";

export async function loginUser(email, password) {

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }

  const data = await response.json();

  localStorage.setItem("token", data.token);

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

export function authHeader() {

  const token = getToken();

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };

}