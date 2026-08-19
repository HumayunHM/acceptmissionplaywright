export class IdeaPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.ideasNavButton = page.getByRole("button", { name: "Ideas" });
    this.backToFunnelLink = page.getByRole("link", { name: "Back to funnel" });

    this.funnelDropdown = page.getByRole("combobox").first();
    this.funnelSearchInput = page.getByPlaceholder("Search", { exact: true }); // verify this once you open it — guessing based on your notes-app pattern

    // Create Idea
    this.addIdeaButton = page
      .getByRole("button", { name: "Add Idea", exact: true })
      .first();
    this.enterManuallyButton = page.getByRole("button", {
      name: "Enter manually",
    });
    this.editDialog = page.getByRole("dialog", {
      name: "Edit title & description",
    });
    this.titleInput = this.editDialog.getByRole("textbox", { name: "Title" });
    this.descriptionEditor = this.editDialog.locator(
      '.tiptap[contenteditable="true"]',
    );
    this.tagInput = this.editDialog.getByRole("textbox", { name: "Tag input" });
    this.closeButton = this.editDialog.getByRole("button", { name: "Close" });

    this.laneByName = (laneName) =>
      this.page.locator(".flex.h-full.w-70").filter({ hasText: laneName });

    // Dynamic locator — idea card on the funnel board, by title + description
    //   await page.getByRole('checkbox').click();
    this.actionsButton = page.getByRole("button", { name: "Actions" });
    this.deleteButton = page.getByRole("menuitem", { name: "Delete ideas" });
    this.ideaCardInLane = (laneName, ideaTitle) =>
      this.page
        .locator(".flex.h-full.w-70")
        .filter({ hasText: laneName })
        .getByRole("link", { name: ideaTitle, exact: true });
    this.ideaCard = (title, description) =>
      page.getByRole("link", { name: `${title} ${description}`, exact: true });

    this.ideaCardContainerInLane = (laneName, ideaTitle) =>
      this.page
        .locator(".flex.h-full.w-70")
        .filter({ hasText: laneName })
        .locator(".group\\/card")
        .filter({ hasText: ideaTitle });

    this.ideaCardCheckbox = (laneName, ideaTitle) =>
      this.ideaCardContainerInLane(laneName, ideaTitle).getByRole("checkbox");
    this.detailsTab = page.getByRole("tab", { name: "Details" });
    this.selectDepartmentButton = page.getByRole("button", {
      name: "Select department",
      exact: true,
    });
    this.departmentOption = (departmentName) =>
      page.getByRole("button", { name: new RegExp(`^${departmentName}\\b`) });
    this.selectDepartmentsButton = page.getByRole("button", {
      name: "Select departments",
    });
    this.departmentCheckbox = (departmentName) =>
      page.getByRole("checkbox", { name: `Select ${departmentName}` });
    this.departmentsDoneButton = (count) =>
      page.getByRole("button", { name: `${count} selected` });
    this.detailsCommentEditor = page.locator(
      '.md\\:col-span-2 .tiptap[contenteditable="true"]',
    );

    // Add to constructor:
    this.workTab = page.getByRole("tab", { name: "Work" });
    this.newTaskInput = page.getByRole("textbox", {
      name: "Enter title and hit enter",
    });
    this.taskByTitle = (taskTitle) =>
      page.getByRole("cell", { name: taskTitle, exact: true });

    // Add to constructor:
    this.commentsTab = page.getByRole("tab", { name: "Comments" });
    this.commentInput = page.getByRole("textbox", {
      name: "Write your comment...",
    });
    this.submitCommentButton = page.getByRole("button", { name: "Submit" });
    this.portalToggle = page.getByRole("button", { name: "Portal" });
    this.commentByText = (comment) => page.getByText(comment, { exact: true });

    // Add to constructor:
    this.teamSectionButton = page.getByText("Team", { exact: true });
    this.addTeamMemberButton = page.getByRole("button", { name: "Add" });
    this.selectUserCombobox = page
      .getByRole("combobox")
      .filter({ hasText: "Select a user" });
    this.userOption = (name) => page.getByText(name, { exact: true });
  }

  async goToIdeas() {
    await this.ideasNavButton.click();
  }

  async selectFunnel(funnelName) {
    await this.funnelDropdown.click();
    await this.page.getByText(funnelName, { exact: true }).click();
  }

  async createIdea(title, description, tag) {
    await this.addIdeaButton.click();
    await this.enterManuallyButton.click();

    await this.titleInput.click();
    await this.titleInput.fill(title);
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(description);

    await this.tagInput.click();
    await this.tagInput.fill(tag);
    await this.tagInput.press("Enter");

    await this.closeButton.click();
  }

  async backToFunnel() {
    await this.backToFunnelLink.click();
    await this.page
      .getByText("Idea submitted", { exact: true })
      .waitFor({ state: "visible", timeout: 30000 });
  }

  async deleteIdea(title) {
    const card = this.page.locator(".group\\/card").filter({ hasText: title });
    await card.hover();
    await card.getByRole("checkbox").click();
    await this.actionsButton.click();
    await this.deleteButton.click();
    await card.waitFor({ state: "hidden", timeout: 15000 });
  }

  async openIdea(title) {
    await this.ideaCard(title).click(); // reuses your existing dynamic locator
  }

  async goToDetailsTab() {
    await this.detailsTab.click();
  }

  async selectDepartment(departmentName) {
    await this.selectDepartmentButton.click();
    await this.departmentOption(departmentName).click();
  }

  async selectSecondaryDepartments(departmentNames) {
    await this.selectDepartmentsButton.click();
    for (const name of departmentNames) {
      await this.departmentCheckbox(name).click();
    }
    await this.departmentsDoneButton(departmentNames.length).click();
  }

  async addInternalComment(comment) {
    await this.detailsCommentEditor.click();
    await this.detailsCommentEditor.fill(comment);
  }

  async addTask(taskTitle) {
    await this.workTab.click();
    await this.newTaskInput.fill(taskTitle);
    await this.newTaskInput.press("Enter");
  }

  // Add methods:
  async addInternalTeamComment(comment) {
    await this.commentsTab.click();
    await this.commentInput.waitFor({ state: "visible", timeout: 5000 });
    await this.commentInput.fill(comment);
    await this.submitCommentButton.click();
  }

  async addPortalComment(comment) {
    await this.commentsTab.click();
    await this.portalToggle.click();
    await this.commentInput.waitFor({ state: "visible", timeout: 5000 });
    await this.commentInput.fill(comment);
    await this.submitCommentButton.click();
  }

  // Add method:
  async addTeamMember(name) {
    await this.teamSectionButton.click();
    await this.addTeamMemberButton.click();
    await this.selectUserCombobox.click();
    await this.userOption(name).click();
  }

  async dragIdeaToLane(ideaTitle, fromLaneName, toLaneName) {
    const source = this.ideaCardContainerInLane(fromLaneName, ideaTitle);
    const target = this.laneByName(toLaneName);

    await target.waitFor({ state: "visible", timeout: 10000 });

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);

    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 15 }, 
    );
    await this.page.waitForTimeout(100);

    await this.page.mouse.up();
    await this.page.waitForTimeout(1000);
  }
}
