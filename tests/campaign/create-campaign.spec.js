import { test, expect } from "../../fixtures/idea.fixture.js"; // reusing your existing auth-wired fixture base
import { CampaignPage } from "../../pages/CampaignPage.js";

test.describe("Campaigns", () => {
  test("can create a campaign with correct title and date, then delete it", async ({
    loggedInPage,
  }) => {
    const campaignPage = new CampaignPage(loggedInPage);
    const title = `CAMPAIGN-${Date.now()}`;
    const day = 19; // matches your codegen capture — see note below on making this dynamic

    await campaignPage.goToCampaigns();
    await campaignPage.createCampaign(title, day);

    // Observe: title and date show up correctly right after creation
    await expect(loggedInPage.getByText(title, { exact: true }).first()).toBeVisible();
    await expect(campaignPage.startsDateText("Starts Aug 19")).toBeVisible(); // adjust prefix to match real text

    // Refresh, re-observe — per your test case steps
    await loggedInPage.reload();
    await expect(loggedInPage.getByText(title, { exact: true }).first()).toBeVisible();

    // Navigate back to campaigns list, confirm the card shows the title
    await campaignPage.backToCampaignsList();
    await expect(campaignPage.campaignCardByTitle(title)).toBeVisible();

    // Delete, confirm it disappears
    await campaignPage.deleteCampaign(title);
    await expect(campaignPage.campaignCardByTitle(title)).not.toBeVisible();
  });
});
