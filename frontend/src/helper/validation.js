import toast from "react-hot-toast";

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

export const validateFirstName = (name) => {
  if (!name) return "First name is required!";
  return null; // No error
};
export const validateLastName = (name) => {
  if (!name) return "Last name is required!";
  return null; // No error
};

export const validateJobTitle = (title) => {
  if (!title) {
    return "Title is required!";
  } else if (title.length < 4) {
    return "Title must be at least 4 characters long.";
  }
  return null;
};

export const validateJobDescription = (description) => {
  if (!description) {
    return "Description is required!";
  }
  return null;
};
export const validateJobSalary = (salary) => {
  if (!salary) {
    return "Salary is required";
  }
  return null;
};

export const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber && !/^9\d{9}$/.test(phoneNumber)) {
    return "Please enter a valid Nepali phone number!";
  }
  return null; // No error or phone number is not provided
};

export const validateDisplayEmail = (email) => {
  if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Invalid email address!";
  }
  return null; // No error or email is not provided
};

export const validateDates = (startDate, endDate) => {
  // Check if startDate is a valid date
  if (!startDate || isNaN(new Date(startDate).getTime())) {
    return "Start date must be a valid date!";
  }

  const start = new Date(startDate);

  // Check if endDate is either a valid date or "Present"
  if (endDate && endDate !== "Present") {
    const end = new Date(endDate);

    if (isNaN(end.getTime())) {
      return "End date must be a valid date or 'Present'!";
    }

    // Ensure that start date is before end date
    if (start >= end) {
      return "Start date must be earlier than the end date!";
    }

    // Ensure that end date is not later than today's date, or it must be "Present"
    const today = new Date();
    if (end > today) {
      return "End date cannot be a future date. It must be 'Present'!";
    }
  }

  return null; // No error
};
