import { test as authTest } from "./auth.fixture.js";
import { CampaignPage } from "../pages/CampaignPage.js";

export const test = authTest.extend({
  existingCampaign: async ({ loggedInPage }, use) => {
    const campaignPage = new CampaignPage(loggedInPage);
    await campaignPage.goToCampaigns();

    const title = `CAMPAIGN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const startDate = new Date();
    await campaignPage.createCampaign(title, startDate);

    await use({ title, startDate }); // test runs here

    // Teardown — runs after the test finishes, regardless of pass/fail.
    await campaignPage.backToCampaignsList();
    await campaignPage.deleteCampaign(title);
  },
});

export { expect } from "@playwright/test";
