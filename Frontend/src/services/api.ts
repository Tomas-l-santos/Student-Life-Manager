export async function login(email: string, password: string) {
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {"Content-Type":  "application/json"},
        body: JSON.stringify({email, password})
    });

    return response.json();
}