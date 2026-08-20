import { test, expect } from "../../fixtures/campaign.fixture.js";
import { CampaignPage } from "../../pages/CampaignPage.js";
import { CampaignIdeaPage } from "../../pages/CampaignIdeaPage.js";

test.describe("Campaigns — input type", () => {
  test("changing input type to Improvements updates tabs and submit button on the public view", async ({
    loggedInPage,
    existingCampaign,
  }) => {
    const campaignPage = new CampaignPage(loggedInPage);
    const campaignIdeaPage = new CampaignIdeaPage(loggedInPage);

    await campaignPage.setCampaignInputType("Improvements");

    await campaignPage.openViewCampaign();

    await expect(campaignIdeaPage.tabByLabel("Improvements")).toBeVisible();
    await expect(
      campaignIdeaPage.tabByLabel("Submit Improvement"),
    ).toBeVisible();
    await expect(
      campaignIdeaPage.openSubmitButton("Submit improvement"),
    ).toBeVisible();

    // Old "Ideas" wording should no longer be present
    await expect(campaignIdeaPage.tabByLabel("Ideas")).not.toBeVisible();
    await expect(
      campaignIdeaPage.openSubmitButton("Submit idea"),
    ).not.toBeVisible();

    await campaignPage.openManageCampaign();
  });
});
