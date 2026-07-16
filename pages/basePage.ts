import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = '') {
    await this.page.goto(`https://parabank.parasoft.com${path}`);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
