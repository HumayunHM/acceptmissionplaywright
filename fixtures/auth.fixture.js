// fixtures/auth.fixture.js
import { test as base } from "@playwright/test";

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    await page.goto("/"); // navigate into the authenticated app first
    await use(page);
  },
});

export { expect } from "@playwright/test";
