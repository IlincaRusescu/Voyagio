export function validateFirstName(value) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'First name is required.'
  }

  if (trimmedValue.length < 2) {
    return 'First name must be at least 2 characters.'
  }

  return ''
}

export function validateLastName(value) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Last name is required.'
  }

  if (trimmedValue.length < 2) {
    return 'Last name must be at least 2 characters.'
  }

  return ''
}

export function validateEmail(value) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Email is required.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(trimmedValue)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

export function validatePassword(value) {
  if (!value) {
    return 'Password is required.'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[A-Z]/.test(value)) {
    return 'Password must include at least one uppercase letter.'
  }

  if (!/[a-z]/.test(value)) {
    return 'Password must include at least one lowercase letter.'
  }

  if (!/[0-9]/.test(value)) {
    return 'Password must include at least one number.'
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    return 'Password must include at least one symbol.'
  }

  return ''
}

export function validateConfirmPassword(value, password) {
  if (!value) {
    return 'Please confirm your password.'
  }

  if (value !== password) {
    return 'Passwords do not match.'
  }

  return ''
}

export function validateTerms(accepted) {
  if (!accepted) {
    return 'You must agree to the Terms & Privacy Policy.'
  }

  return ''
}

export function validateCountry(value, countries) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return 'Country is required.'
  }

  const countryExists = countries.some((country) => {
    return country.name.toLowerCase() === trimmedValue.toLowerCase()
  })

  if (!countryExists) {
    return 'Please select a valid country.'
  }

  return ''
}