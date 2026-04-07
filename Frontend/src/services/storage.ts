/* This test was created with assistance from Claude AI (Anthropic, 2026).
 Prompt:“How do i manage localStorage sessions”
 The output was reviewed, modified, and tested by the Muiiz. */
export function saveSession(token: string, email: string, username: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("user_email", email);
  localStorage.setItem("username", username);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUserEmail(): string | null {
  return localStorage.getItem("user_email");
}

export function getUsername(): string | null {
  return localStorage.getItem("username");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("username");
}
