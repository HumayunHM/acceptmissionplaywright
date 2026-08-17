export class StudioPage {
  constructor(page) {
    this.page = page;
    this.userMenuButton = page.getByRole('button', { name: 'Muhammad SQA Super Admin' });
    this.myProfileMenuItem = page.getByRole('menuitem', { name: 'My profile' });
  }

  async openProfileMenu() {
    await this.userMenuButton.click();
  }

  async goToMyProfile() {
    await this.openProfileMenu();
    await this.myProfileMenuItem.click();
  }
}