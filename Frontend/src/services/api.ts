const BASE_URL = "http://localhost:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Authentication
/* This template was developed with assistance from Claude ai (Anthropic, 2025).
 Prompt:“Generate a function that takes in authentification information from backend”
 The output was reviewed, modified, and tested by the Muiiz. */
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

export async function deleteAccount() {
  const res = await fetch(`${BASE_URL}/api/auth/delete-account`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to delete account");
  return result;
}

// Budget
/* This template was developed with assistance from Claude ai (Anthropic, 2025).
 Prompt:“Generate a function that takes in budget information from backend”
 The output was reviewed, modified, and tested by the Muiiz. */
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
  const url = type ? `${BASE_URL}/api/categories?type=${type}` : `${BASE_URL}/api/categories`;
  const res = await fetch(url, { headers: authHeaders() });
  return res.json();
}

export async function getBudgetStatus(month: number, year: number) {
  const res = await fetch(`${BASE_URL}/api/budgets/status?month=${month}&year=${year}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function deleteTransaction(id: string | number) {
  const res = await fetch(`${BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to delete transaction");
  return result;
}

export async function setBudgetLimit(data: {
  category_id: number;
  amount: number;
  month: number;
  year: number;
}) {
  const res = await fetch(`${BASE_URL}/api/budgets`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to set budget limit");
  return result;
}

export async function deleteBudget(id: number) {
  const res = await fetch(`${BASE_URL}/api/budgets/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to delete budget limit");
  return result;
}

// modules
export async function getModules() {
  const res = await fetch(`${BASE_URL}/api/modules`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load modules");
  return data;
}

export async function addModule(data: {
  name: string;
  code: string;
  credits: number;
  year_of_study: number;
  academic_year: string;
  deadline: string;
}) {
  const res = await fetch(`${BASE_URL}/api/modules`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to add module");
  return result;
}

export async function deleteModule(moduleId: string) {
  const res = await fetch(`${BASE_URL}/api/modules/${moduleId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to delete module");
  return result;
}

export async function addAssessment(data: {
  module_id: string;
  name: string;
  assessment_type: string;
  score: number;
  max_score: number;
  weight: number;
  date: string;
}) {
  const res = await fetch(`${BASE_URL}/api/assessments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to add assessment");
  return result;
}

// deadlines
/* This template was developed with assistance from Claude ai (Anthropic, 2025).
 Prompt:“Generate a function that takes in deadline information from backend”
 The output was reviewed, modified, and tested by the Muiiz. */
export async function getDeadlines() {
  const res = await fetch(`${BASE_URL}/api/deadlines`, { headers: authHeaders() });
  return res.json();
}

export async function addDeadline(data: {
  title: string;
  module_name: string;
  due_date: string;
  priority: string;
  status?: string;
  notes?: string;
}) {
  const res = await fetch(`${BASE_URL}/api/deadlines`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to add deadline");
  return result;
}

export async function updateDeadline(id: number, updates: object) {
  const res = await fetch(`${BASE_URL}/api/deadlines/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Failed to update deadline");
  return result;
}

export async function deleteDeadline(id: number) {
  const res = await fetch(`${BASE_URL}/api/deadlines/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

// timetable
/* This template was developed with assistance from Claude ai (Anthropic, 2025).
 Prompt:“Generate a function that takes in timetable information from backend”
 The output was reviewed, modified, and tested by the Muiiz. */
export async function getTimetable(day?: string) {
  const url = day ? `${BASE_URL}/api/timetable?day=${day}` : `${BASE_URL}/api/timetable`;
  const res = await fetch(url, { headers: authHeaders() });
  return res.json();
}

export async function addTimetableEntry(data: {
  module_name: string;
  location: string;
  entry_type: string;
  day: string;
  start_time: string;
  end_time: string;
}) {
  const res = await fetch(`${BASE_URL}/api/timetable`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTimetableEntry(id: number) {
  const res = await fetch(`${BASE_URL}/api/timetable/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}
