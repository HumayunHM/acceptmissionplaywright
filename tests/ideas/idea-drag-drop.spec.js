import { test, expect } from "../../fixtures/idea.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test.describe("Idea Drag and Drop", () => {
  test("can drag an idea between adjacent fields (Idea Submitted to Review Idea)", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);

    await ideaPage.backToFunnel(); // NEW — get back to the Kanban board before dragging

    await ideaPage.dragIdeaToLane(
      existingIdea.title,
      "Idea submitted",
      "Review idea",
    );

    await expect(
      ideaPage.ideaCardInLane("Review idea", existingIdea.title),
    ).toBeVisible();
    await expect(
      ideaPage.ideaCardInLane("Idea submitted", existingIdea.title),
    ).not.toBeVisible();
  });

  test("can drag an idea between non adjacent fields (Idea Submitted to Create Proposal)", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);

    await ideaPage.backToFunnel();

    await ideaPage.dragIdeaToLane(
      existingIdea.title,
      "Idea submitted",
      "Create proposal",
    );

    await expect(
      ideaPage.ideaCardInLane("Create proposal", existingIdea.title),
    ).toBeVisible();
    await expect(
      ideaPage.ideaCardInLane("Idea submitted", existingIdea.title),
    ).not.toBeVisible();
  });
});
