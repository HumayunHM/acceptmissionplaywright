import { test, expect } from "../../fixtures/idea.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test.describe("Idea Comments", () => {
  test("can add an internal team comment", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);
    const comment = `internal comment ${Date.now()}`;

    await ideaPage.addInternalTeamComment(comment);

    await expect(ideaPage.commentByText(comment)).toBeVisible();
  });

  test("can add a portal comment", async ({ loggedInPage, existingIdea }) => {
    const ideaPage = new IdeaPage(loggedInPage);
    const comment = `portal comment ${Date.now()}`;

    await ideaPage.addPortalComment(comment);

    await expect(ideaPage.commentByText(comment)).toBeVisible();
  });
});
