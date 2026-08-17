// fixtures/idea.fixture.js
import { test as authTest } from "./auth.fixture.js";
import { IdeaPage } from "../pages/IdeaPage.js";

export const test = authTest.extend({
  existingIdea: async ({ loggedInPage }, use) => {
    const ideaPage = new IdeaPage(loggedInPage);
    await ideaPage.goToIdeas();
    await ideaPage.selectFunnel("Auto Testing");

    const title = `IDEA-${Date.now()}`;
    const description = `DESC-${Date.now()}`;
    await ideaPage.createIdea(title, description, "Accept Mission");

    await use({ title, description }); // test runs here

    // Teardown — runs after the test finishes, regardless of pass/fail
    await ideaPage.backToFunnel();
    await ideaPage.deleteIdea(title);
  },
});

export { expect } from "@playwright/test";
