import { test, expect } from "../../fixtures/idea.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test.describe("Idea Work", () => {
  test("can add a task to an idea", async ({ loggedInPage, existingIdea }) => {
    const ideaPage = new IdeaPage(loggedInPage);

    const taskTitle = `task-${Date.now()}`;
    await ideaPage.addTask(taskTitle);

    await expect(ideaPage.taskByTitle(taskTitle)).toBeVisible();
  });
});
