import { test, expect } from "../../fixtures/auth.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test("can create a new idea manually", async ({ loggedInPage }) => {
  test.setTimeout(60_000);
  const ideaPage = new IdeaPage(loggedInPage);

  await ideaPage.goToIdeas();

  const title = `IDEA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const description = `DESC-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  await ideaPage.selectFunnel("Auto Testing");
  await ideaPage.createIdea(title, description, "Accept Mission");
  await ideaPage.backToFunnel();

  await expect(ideaPage.ideaCardInLane("Idea submitted", title)).toBeVisible({
    timeout: 30_000,
  });

  await ideaPage.deleteIdea(title);
  await expect(
    ideaPage.ideaCardInLane("Idea submitted", title),
  ).not.toBeVisible({
    timeout: 15_000,
  });
});
