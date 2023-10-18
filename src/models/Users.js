class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static createUser(username, email, password) {
    return new User(username, email, password);
  }

  static validateUser(user) {
    // You can implement validation logic here (e.g., check if the data meets your requirements).
    // This is just a simple example; you might use a library for validation.
    if (
      typeof user === "object" &&
      user.username &&
      user.email &&
      user.password
    ) {
      return true;
    }
    return false;
  }
}

export default User;
