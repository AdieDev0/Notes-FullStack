export const validateEmail = (email) => {
    const regex = /^[\s@^]+@[^\s@]+\.[^\s@]+$/;
    return regex.text(email);
}