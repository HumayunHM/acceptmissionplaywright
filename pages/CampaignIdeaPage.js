export class CampaignIdeaPage {
  constructor(page) {
    this.page = page;

    // --- Submit-idea flow ---
    // Two buttons share the exact accessible name "Submit idea": the one that
    // opens the form, and the one inside the form that actually submits it.
    // Role+name alone is ambiguous (see bug-pattern doc #2), so we disambiguate
    // via each button's distinct, developer-authored color class instead of a
    // positional index (bg-success-500 = open form, bg-primary = submit form).
    this.openSubmitIdeaButton = page.locator("button.bg-success-500", {
      hasText: "Submit idea",
    });
    this.confirmSubmitIdeaButton = page.locator(
      "button.bg-primary.rounded-full",
      { hasText: "Submit idea" },
    );

    // Title/Description sit in generic `div[data-field]` wrappers with no
    // id/for link between <label> and <input>/<.tiptap>, so getByLabel can't
    // associate them. Scope to the nearest labeled container instead.
    this.ideaTitleInput = page
      .locator("div[data-field]")
      .filter({ has: page.getByText("Title", { exact: true }) })
      .locator("input[type='text']");
    this.ideaDescriptionEditor = page
      .locator("div[data-field]")
      .filter({ has: page.getByText("Description", { exact: true }) })
      .locator(".tiptap");

    this.tagInput = page.getByRole("textbox", { name: "Tag input" });

    this.departmentSelectTrigger = page
      .getByRole("combobox")
      .filter({ hasText: "Select option" });
    this.departmentOption = (name) =>
      page.getByRole("option", { name, exact: true });

    // --- Idea card (grid view) ---
    this.ideaCardContainer = (title) =>
      page.locator("div.relative.group").filter({ hasText: title });

    // Both the like button and the comments-count button on a card have an
    // accessible name that's just a bare digit ("0", "1", ...) — identical to
    // each other and liable to collide with other "0"/"1" text on the page.
    // Scope to each button's icon instead of trusting name matching.
    this.ideaLikeButton = (title) =>
      this.ideaCardContainer(title)
        .locator("button")
        .filter({ has: page.locator("svg.lucide-heart") });
    this.ideaCommentsCount = (title) =>
      this.ideaCardContainer(title)
        .locator("button")
        .filter({ has: page.locator("svg.lucide-message-circle") });
    this.ideaDetailsButton = (title) =>
      this.ideaCardContainer(title).getByRole("button", { name: "Details" });

    // --- Idea detail view ---
    this.commentsTabButton = page.getByRole("button", { name: /^Comments/ });
    this.commentInput = page.getByPlaceholder("Write your comment...");
    this.commentSubmitButton = page.getByRole("button", {
      name: "Submit",
      exact: true,
    });
    this.commentByText = (text) =>
      page.locator("pre").filter({ hasText: text });
    this.backToAllIdeasButton = page.getByRole("button", {
      name: "← All ideas",
    });

    this.ideaCardOverlayButton = (title) =>
      this.ideaCardContainer(title).locator("button.absolute.inset-0");
  }

  async openSubmitIdeaForm() {
    await this.openSubmitIdeaButton.click();
  }

  async fillIdeaForm({ title, description, tags = [] }) {
    await this.ideaTitleInput.fill(title);

    await this.ideaDescriptionEditor.click();
    await this.ideaDescriptionEditor.pressSequentially(description);

    for (const tag of tags) {
      await this.tagInput.click();
      await this.tagInput.fill(tag);
      await this.tagInput.press("Enter");
    }
  }

  async submitIdea() {
    await this.confirmSubmitIdeaButton.click();
  }

  async likeIdea(title) {
    await this.ideaLikeButton(title).click();
  }

  async openIdeaDetails(title) {
    await this.ideaCardOverlayButton(title).click();
  }

  async addComment(text) {
    await this.commentsTabButton.click();
    await this.commentInput.click();
    await this.commentInput.fill(text);
    await this.commentSubmitButton.click();
    await this.commentByText(text).waitFor({ state: "visible" });
  }

  async backToAllIdeas() {
    await this.backToAllIdeasButton.click();
  }
}
