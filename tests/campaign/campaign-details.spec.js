import { test, expect } from "../../fixtures/campaign.fixture.js";
import { CampaignPage } from "../../pages/CampaignPage.js";

function atMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = atMidnight(date);
  next.setDate(next.getDate() + days);
  return next;
}

function shortDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function longMonthDay(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

test.describe("Campaigns", () => {
  test("can fill campaign details and see them on the view page", async ({
    loggedInPage,
    existingCampaign,
  }) => {
    const campaignPage = new CampaignPage(loggedInPage);
    const { title, startDate } = existingCampaign;
    const description = `DESC-${Date.now()}`;
    const briefing = `BRIEFING-${Date.now()}`;
    const department = "Marketing";
    const videoUrl = "https://youtu.be/_tsg6IUSruo?si=rWRkqpCfWmUjgEbS";
    const tags = {
      objectives: ["OBJ1", "OBJ2"],
      inScope: ["SCOPE1", "SCOPE2"],
      outOfScope: ["OUTSCO1", "OUTSCO2"],
      criteria: ["CRI1", "CRI2"],
    };

    const endDate = addDays(startDate, 28);
    const finishedIdeasDate = addDays(startDate, 36);

    await expect(campaignPage.titleField).toHaveValue(title);
    await campaignPage.fillDescriptionAndBriefing(description, briefing);
    await campaignPage.selectDepartment(department);
    await campaignPage.addVideoLink(videoUrl);
    await campaignPage.setStatusLive();
    await expect(
      loggedInPage.getByRole("button", { name: "Live" }),
    ).toBeVisible();
    await campaignPage.setCampaignEndDate(startDate, endDate);
    await campaignPage.setFinishedIdeasDate(finishedIdeasDate);
    await campaignPage.addContextTags(tags);

    await expect(loggedInPage.getByText("OBJ1", { exact: true })).toBeVisible();

    await campaignPage.openViewCampaign();

    await expect(
      loggedInPage.getByRole("heading", { name: title }),
    ).toBeVisible();
    await expect(
      loggedInPage.locator("span").filter({ hasText: "Live" }),
    ).toBeVisible();
    await expect(loggedInPage.getByText(description)).toBeVisible();
    await expect(loggedInPage.getByText(briefing)).toBeVisible();
    await expect(
      loggedInPage.getByText(department, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      loggedInPage.getByText(`${longMonthDay(endDate)},`).first(),
    ).toBeVisible();
    await expect(
      loggedInPage.getByText(
        new RegExp(
          `Finished Ideas\\s*Planned\\s*${shortDate(finishedIdeasDate)}`,
        ),
      ),
    ).toBeVisible();

    for (const tag of [
      ...tags.objectives,
      ...tags.inScope,
      ...tags.outOfScope,
      ...tags.criteria,
    ]) {
      await expect(loggedInPage.getByText(tag, { exact: true })).toBeVisible();
    }

    await expect(
      campaignPage.campaignVideoFrame
        .contentFrame()
        .getByRole("link", { name: /Lesson 3\.3 Interdepartmental/ }),
    ).toBeVisible();

    await campaignPage.navToManage();
  });
});
