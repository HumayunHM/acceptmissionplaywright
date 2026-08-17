import { test, expect } from "../../fixtures/idea.fixture.js";
import { IdeaPage } from "../../pages/IdeaPage.js";

test.describe("Idea Details", () => {
  test("can assign a primary department", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);

   //await ideaPage.openIdea(existingIdea.title);
    await ideaPage.goToDetailsTab();
    await ideaPage.selectDepartment("General");

    await expect(
      loggedInPage.getByText("General", { exact: false }),
    ).toBeVisible();
  });

  test("can add an internal comment on the details tab", async ({
    loggedInPage,
    existingIdea,
  }) => {
    const ideaPage = new IdeaPage(loggedInPage);

    //await ideaPage.openIdea(existingIdea.title);
    await ideaPage.goToDetailsTab();
    await ideaPage.addInternalComment("internal comment 1");

    await expect(loggedInPage.getByText("internal comment 1")).toBeVisible();
  });
});
