export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByTestId("login-submit-button");

    this.invalidCredentialsMessage = page.getByText(
      "We could not sign you in please try again.",
    );
    this.emailRequiredMessage = page.getByText("Enter your email address.");
    this.passwordRequiredMessage = page.getByText("Enter your password.");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
