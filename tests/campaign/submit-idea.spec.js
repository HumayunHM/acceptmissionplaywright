import { test, expect } from "../../fixtures/campaign.fixture.js";
import { CampaignPage } from "../../pages/CampaignPage.js";
import { CampaignIdeaPage } from "../../pages/CampaignIdeaPage.js";

test.describe("Campaigns — idea submission", () => {
  test("can submit an idea, like it, comment on it, and see updated counts after refresh", async ({
    loggedInPage,
    existingCampaign,
  }) => {
    const campaignPage = new CampaignPage(loggedInPage);
    const campaignIdeaPage = new CampaignIdeaPage(loggedInPage);

    const ideaTitle = `IDEA-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const ideaDescription = `DESC-${Date.now()}`;
    const tags = ["TAG1", "TAG2", "TAG3"];
    const commentText = `COMMENT-${Date.now()}`;

    await campaignPage.openViewCampaign();

    await campaignIdeaPage.openSubmitIdeaForm();
    await campaignIdeaPage.fillIdeaForm({
      title: ideaTitle,
      description: ideaDescription,
      tags,
    });
    await campaignIdeaPage.submitIdea();

    // Idea shows up with the right title, description, and tags
    await expect(campaignIdeaPage.ideaCardContainer(ideaTitle)).toBeVisible();
    await expect(
      campaignIdeaPage.ideaCardContainer(ideaTitle).getByText(ideaDescription),
    ).toBeVisible();
    for (const tag of tags) {
      await expect(
        campaignIdeaPage
          .ideaCardContainer(ideaTitle)
          .getByText(tag.toLowerCase(), { exact: true }),
      ).toBeVisible();
    }

    // Like the idea
    await campaignIdeaPage.likeIdea(ideaTitle);
    await expect(campaignIdeaPage.ideaLikeButton(ideaTitle)).toContainText("1");

    // Open details, add a comment
    await campaignIdeaPage.openIdeaDetails(ideaTitle);
    await campaignIdeaPage.addComment(commentText);
    await expect(campaignIdeaPage.commentByText(commentText)).toBeVisible();

    // Back to all ideas, refresh, re-observe
    await campaignIdeaPage.backToAllIdeas();
    await loggedInPage.reload();

    await expect(campaignIdeaPage.ideaCardContainer(ideaTitle)).toBeVisible();
    await expect(campaignIdeaPage.ideaLikeButton(ideaTitle)).toContainText("1");
    await expect(campaignIdeaPage.ideaCommentsCount(ideaTitle)).toContainText(
      "1",
    );

    // Return to the admin edit page so fixture teardown can delete the campaign
    await campaignPage.navToManage();
  });
});
