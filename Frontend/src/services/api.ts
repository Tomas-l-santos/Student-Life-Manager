const BASE_URL = "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
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