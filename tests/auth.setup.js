import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import fs from "fs";
import path from "path";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);

  // Wait for concrete proof login succeeded before saving state
  await page
    .getByRole("button", { name: /Super Admin/i })
    .waitFor({ state: "visible", timeout: 20000 });

  await page.context().storageState({ path: authFile });
});
