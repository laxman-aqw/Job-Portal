export const validateEmail = (email) => {
  if (!email) return "Email is required!";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Invalid email address!";
  }
  return null; // No error
};

export const validatePassword = (password) => {
  if (!password) return "Password is required!";
  return null;
};

export const validatePasswordRequirement = (password) => {
  if (!password) return "Password is required!";
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must contain at least one special character.";

  return null;
};

export const validateName = (name) => {
  if (!name) return "Company name is required!";
  return null; // No error
};
