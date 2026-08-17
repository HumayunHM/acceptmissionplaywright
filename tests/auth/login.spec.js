import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage.js";
import { StudioPage } from "../../pages/StudioPage.js";

test.describe("Login", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("logs in with valid credentials", async ({ page }) => {
    const studioPage = new StudioPage(page);
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(studioPage.userMenuButton).toBeVisible();
  });

  test("shows an error with wrong email and wrong password", async ({
    page,
  }) => {
    await loginPage.login("wrong@mailinator.com", "WrongPassword123!");
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  test("shows validation errors with both fields empty", async ({ page }) => {
    await loginPage.login("", "");
    await expect(loginPage.emailRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
  });

  test("shows validation error with only email filled", async ({ page }) => {
    await loginPage.login(process.env.LOGIN_EMAIL, "");
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
  });

  test("shows validation error with only password filled", async ({ page }) => {
    await loginPage.login("", process.env.LOGIN_PASSWORD);
    await expect(loginPage.emailRequiredMessage).toBeVisible();
  });
});
