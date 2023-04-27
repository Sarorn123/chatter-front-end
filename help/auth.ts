export function checkAuth() {
    return !!localStorage.getItem("chat-currentUser");
}

export async function getCurrentUser() {
    return await JSON.parse(localStorage.getItem("chat-currentUser") || "{}");
}