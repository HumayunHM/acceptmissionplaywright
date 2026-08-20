import { test, expect } from "../../fixtures/idea.fixture.js";
import { CampaignPage } from "../../pages/CampaignPage.js";

function atMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

test.describe("Campaigns", () => {
  test("can create a campaign with correct title and date, then delete it", async ({
    loggedInPage,
  }) => {
    const campaignPage = new CampaignPage(loggedInPage);
    const title = `CAMPAIGN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const startDate = atMidnight(new Date());
    const startLabel = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // e.g. "Aug 20"

    await campaignPage.goToCampaigns();
    await campaignPage.createCampaign(title, startDate);

    // Observe: title and date show up correctly right after creation
    await expect(
      loggedInPage.getByText(title, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      campaignPage.startsDateText(`Starts ${startLabel}`),
    ).toBeVisible();

    // Refresh, re-observe — per your test case steps
    await loggedInPage.reload();
    await expect(
      loggedInPage.getByText(title, { exact: true }).first(),
    ).toBeVisible();

    // Navigate back to campaigns list, confirm the card shows the title
    await campaignPage.backToCampaignsList();
    await expect(campaignPage.campaignCardByTitle(title)).toBeVisible();

    // Delete, confirm it disappears
    await campaignPage.deleteCampaign(title);
    await expect(campaignPage.campaignCardByTitle(title)).not.toBeVisible();
  });
});
