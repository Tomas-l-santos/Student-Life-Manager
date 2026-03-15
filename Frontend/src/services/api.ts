const BASE_URL = "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(
  email: string,
  username: string,
  password: string,
  birthdate: string
) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, birthdate }),
  });
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token: string, new_password: string, email: string) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password, email }),
  });
  return res.json();
}

export async function getTransactions() {
  const res = await fetch(`${BASE_URL}/api/transactions`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function addTransaction(data: {
  category_id: number;
  amount: number;
  description: string;
  transaction_date: string;
}) {
  const res = await fetch(`${BASE_URL}/api/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCategories(type?: "income" | "expense") {
  const url = type
    ? `${BASE_URL}/api/categories?type=${type}`
    : `${BASE_URL}/api/categories`;
  const res = await fetch(url, { headers: authHeaders() });
  return res.json();
}

export async function getBudgetStatus(month: number, year: number) {
  const res = await fetch(
    `${BASE_URL}/api/budgets/status?month=${month}&year=${year}`,
    { headers: authHeaders() }
  );
  return res.json();
}