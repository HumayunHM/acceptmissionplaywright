export class CampaignPage {
  constructor(page) {
    this.page = page;

    this.ideaCollectingButton = page.getByRole("button", {
      name: "Idea collecting",
    });
    this.campaignsNavLink = page
      .getByRole("navigation")
      .getByRole("link", { name: "Campaigns" });
    this.campaignsLink = page.getByRole("link", { name: "Campaigns" });

    this.addCampaignLink = page.getByRole("link", { name: "Add campaign" });
    this.titleInput = page.getByRole("textbox", {
      name: "Example: How can we improve",
    });
    this.datePickerButton = page.getByRole("button", { name: "Pick a date" });
    this.dateGridCell = (day) =>
      page.getByRole("gridcell", { name: String(day), exact: true });
    this.datePickerOverlay = page.locator(".fixed.inset-0");
    this.createCampaignButton = page.getByRole("button", {
      name: "Create campaign",
    });

    this.startsDateText = (dateText) =>
      page.locator("span").filter({ hasText: dateText });

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

    this.descriptionTextarea = page.locator("textarea");
    this.briefingEditor = page.locator(".tiptap");
    this.detailsTab = page.getByRole("tab", { name: "Details" });
    this.selectDepartmentButton = page.getByRole("button", {
      name: "Select department",
    });
    this.departmentOption = (name) =>
      page.getByRole("button", { name: new RegExp(`^${name}\\b`) });
    this.videoUrlInput = page.getByRole("textbox", {
      name: "Add YouTube or Vimeo URL",
    });
    this.planningTab = page.getByRole("tab", { name: "Planning" });
    this.contextTab = page.getByRole("tab", { name: "Context" });
    this.viewCampaignLink = page.getByRole("link", { name: "View Campaign" });
    this.manageCampaignLink = page.getByRole("link", {
      name: "Manage campaign",
    });
    this.manageActionButton = page.getByRole("button", { name: "Action" });
    this.manageDeleteItem = page.getByText("Delete", { exact: true });
    this.statusTrigger = this.page.getByRole("button", {
      name: /^(Draft|Live)$/,
    });

    this.liveOption = page.getByRole("option", { name: "Live", exact: true });
    this.finishedIdeasLabel = page.getByText("Finished Ideas", { exact: true });
    this.saveItemButton = page.getByRole("button", { name: "Save item" });
    this.campaignVideoFrame = page.locator('iframe[title="Campaign video"]');
    this.createDialog = page.getByRole("dialog");
    this.titleField = this.page
      .locator("label")
      .filter({ has: this.page.locator("span", { hasText: "Title" }) })
      .locator("xpath=following-sibling::input[1]");

    // in the constructor
    this.inputTypeTrigger = page
      .locator("label")
      .filter({ hasText: "Campaign input type" })
      .locator("xpath=following-sibling::div[1]")
      .getByRole("combobox");
    // The popover is rendered as a dialog (aria-haspopup="dialog" on the trigger),
    // not a listbox, so options are matched by text inside that dialog rather
    // than getByRole('option').
    this.inputTypeOption = (label) =>
      page.getByRole("dialog").getByText(label, { exact: true });
  }

  async goToCampaigns() {
    await this.ideaCollectingButton.click();
    await this.campaignsNavLink.click();
  }

  async createCampaign(title, date = new Date()) {
    await this.addCampaignLink.click();
    await this.titleInput.fill(title);

    await this.datePickerButton.click();
    await this.pickCalendarDay(date);
    await this.datePickerOverlay.click();

    await this.createCampaignButton.click();
    await this.createDialog.waitFor({ state: "hidden" });
    await this.titleField.waitFor({ state: "visible" });
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

  async fillDescriptionAndBriefing(description, briefing) {
    await this.descriptionTextarea.click();
    await this.descriptionTextarea.fill(description);

    await this.briefingEditor.click();
    await this.briefingEditor.pressSequentially(briefing);
    await this.page.getByRole("heading", { name: "Campaign identity" }).click();
    await this.waitForAutosave();
  }

  async selectDepartment(name) {
    await this.detailsTab.click();
    await this.selectDepartmentButton.click();
    await this.departmentOption(name).click();
  }

  async addVideoLink(url) {
    await this.videoUrlInput.fill(url);

    await this.waitForAutosave();
  }

  async setStatusLive() {
    await this.page.getByRole("button", { name: "Draft" }).click();
    await this.page
      .getByRole("menuitem", { name: "Live", exact: true })
      .click();
  }

  async setCampaignEndDate(startDate, endDate) {
    await this.planningTab.click();
    const startLabel = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    await this.page
      .getByRole("button", { name: new RegExp(`^${startLabel}`) })
      .click();
    await this.pickCalendarDay(endDate);
    await this.closeDatePicker();
    await this.waitForAutosave();
  }

  async setFinishedIdeasDate(date) {
    await this.finishedIdeasLabel.click();
    await this.page
      .getByRole("button", { name: /\d{1,2}\/\d{2}\/\d{4}/ })
      .click();
    await this.pickCalendarDay(date);
    await this.saveItemButton.click();
  }

  async addContextTags({ objectives, inScope, outOfScope, criteria }) {
    await this.contextTab.click();
    await this.addTagsUnder("Objectives", objectives);
    await this.addTagsUnder("In scope", inScope);
    await this.addTagsUnder("Out of scope", outOfScope);
    await this.addTagsUnder("Evaluation criteria", criteria);

    await this.waitForAutosave();
  }

  async openViewCampaign() {
    await this.viewCampaignLink.click();
    await this.page
      .getByRole("tablist")
      .waitFor({ state: "visible", timeout: 15000 });
  }

  async openManageCampaign() {
    await this.manageCampaignLink.click();
  }

  async deleteFromManage() {
    await this.manageActionButton.click();
    await this.manageDeleteItem.click();
    await this.confirmDeleteButton.click();
  }

  async addTagsUnder(heading, tags) {
    const card = this.page.locator("div.rounded-xl").filter({
      has: this.page.getByRole("heading", { name: heading, exact: true }),
    });
    const input = card.getByPlaceholder("Add tag...");

    for (const tag of tags) {
      await input.click();
      await input.pressSequentially(tag);
      await input.press("Enter");
      await card.getByText(tag, { exact: true }).waitFor({ state: "visible" });
    }
  }

  async pickCalendarDay(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = String(date.getDate());
    await this.page
      .getByLabel(month)
      .getByRole("gridcell", { name: day })
      .click();
  }

  async closeDatePicker() {
    if (await this.datePickerOverlay.isVisible()) {
      await this.datePickerOverlay.click();
    } else {
      await this.page.keyboard.press("Escape");
    }
  }

  async waitForAutosave() {
    const saving = this.page.getByText("Saving", { exact: true });
    await saving.waitFor({ state: "visible", timeout: 15000 });
    await saving.waitFor({ state: "hidden", timeout: 15000 });
  }

  async waitForTitleInField(title) {
    await expect(this.titleField).toHaveValue(title);
  }

  async navToManage() {
    await this.manageCampaignLink.click();
  }

  async setCampaignInputType(label) {
    await this.detailsTab.click();
    await this.inputTypeTrigger.click();
    await this.inputTypeOption(label).click();
    await this.waitForAutosave();
  }
}
