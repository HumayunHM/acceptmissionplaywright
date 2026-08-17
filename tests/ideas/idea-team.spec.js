import { test, expect } from "../../fixtures/idea.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test.describe("Idea Team", () => {
  test("can add a team member to an idea", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);
    const memberName = "faafaw fsafa"; // known test account from your codegen capture

    await ideaPage.addTeamMember(memberName);

    await expect(ideaPage.userOption(memberName)).toBeVisible();
  });
});
