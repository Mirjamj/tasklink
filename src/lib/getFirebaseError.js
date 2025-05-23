export const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Email address already in use.'
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/weak-password':
      return 'Password is too weak, please choose a stronger password.'
    default:
      return 'An error occured, please try again later.'
  }
}
