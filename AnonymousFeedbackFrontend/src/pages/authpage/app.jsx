// src/services/Auth/App.js
export const authService = {
  login: async (formData) => {
    return handleAuthRequest('login', formData);
  },

  register: async (formData) => {
    return handleAuthRequest('register', formData);
  }
};

async function handleAuthRequest(endpoint, formData) {
  const response = await fetch(`http://localhost:8080/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(data.message || data || "Something went wrong");
  }

  return data;
}