export class CampaignPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.ideaCollectingButton = page.getByRole("button", {
      name: "Idea collecting",
    });
    this.campaignsNavLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Campaigns" });
    this.campaignsLink = page.getByRole("link", { name: "Campaigns" });

    // Create campaign
    this.addCampaignLink = page.getByRole("link", { name: "Add campaign" });
    this.titleInput = page.getByRole("textbox", {
      name: "Example: How can we improve",
    });
    this.datePickerButton = page.getByRole("button", { name: "Pick a date" });
    // NOTE: hardcoded day-of-month from codegen — needs to be dynamic, see createCampaign()
    this.dateGridCell = (day) =>
      page.getByRole("gridcell", { name: String(day), exact: true });
    this.datePickerOverlay = page.locator(".fixed.inset-0");
    this.createCampaignButton = page.getByRole("button", {
      name: "Create campaign",
    });

    // Campaign detail view (right after creation)
    this.startsDateText = (dateText) =>
      page.locator("span").filter({ hasText: dateText });

    // Campaign list / delete
    this.campaignCardByTitle = (title) =>
      page.getByText(title, { exact: true });
    this.campaignCardContainer = (title) =>
      page.locator("div.relative.h-full").filter({ hasText: title });
    this.campaignCheckbox = (title) =>
      this.campaignCardContainer(title).getByRole("checkbox");

    this.actionsButton = page.getByRole("button", { name: "Actions" });
    this.deleteMenuItem = page.getByRole("menuitem", { name: "Delete" });
    this.confirmDeleteButton = page.getByRole("button", {
      name: "Delete campaign",
    });
  }

  async goToCampaigns() {
    await this.ideaCollectingButton.click();
    await this.campaignsNavLink.click();
  }

  async createCampaign(title, day) {
    await this.addCampaignLink.click();
    await this.titleInput.fill(title);

    await this.datePickerButton.click();
    await this.dateGridCell(day).click();
    await this.datePickerOverlay.click(); // closes the date picker overlay, per your codegen capture

    await this.createCampaignButton.click();
  }

  async backToCampaignsList() {
    await this.campaignsLink.click();
  }

  async deleteCampaign(title) {
    await this.campaignCheckbox(title).click();
    await this.actionsButton.click();
    await this.deleteMenuItem.click();
    await this.confirmDeleteButton.click();
    await this.campaignCardByTitle(title).waitFor({
      state: "hidden",
      timeout: 15000,
    });
  }
}
