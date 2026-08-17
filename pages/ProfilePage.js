export class ProfilePage {
  constructor(page) {
    this.page = page;
    this.userNameHeading = page.getByText("Muhammad SQA Super Admin");
  }
}
