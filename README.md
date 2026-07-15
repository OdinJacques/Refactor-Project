# Playwright POM Refactor — ParaBank Starter Repo (Pre-Refactor Snapshot)

This repo is the **"before" state** for a refactor exercise: turn a flat Playwright
test suite into a layered Page Object Model with:

- one `BasePage` class,
- chained page objects (each action returns the next page object),
- one shared **component object** for UI that repeats across pages.

Commit this state first, do the refactor on top of it, and diff the two to review
the change.

## Site under test

**[ParaBank](https://parabank.parasoft.com/parabank/index.htm)** — Parasoft's
demo online banking app, purpose-built for test-automation practice.

Unlike Sauce Demo, ParaBank has no fixed seeded login. Every test in this repo
registers a **fresh, unique customer** (`qa_user_${Date.now()}`) rather than
depending on a shared account, since the app persists real state in a shared
database and reusing one username across test runs would eventually collide.
This is also why the registration form gets filled out in full in nearly every
spec — that duplication is one of the things you'll remove in the refactor.

> **Heads up:** ParaBank is a live third-party demo site outside my control, and
> its exact field `id`s/`name`s below were written from documented behavior of
> the app rather than a fresh browser check. Skim the form once in a browser
> before you start refactoring, and adjust any selector that's drifted.

## Tech stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- Chromium (Desktop Chrome project only, kept minimal for this exercise)

## Project structure (current — flat)

```
parabank-pom-refactor-starter/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── tests/
│   ├── registration.spec.ts
│   ├── login.spec.ts
│   ├── accounts.spec.ts
│   └── transfer-funds.spec.ts
└── README.md
```

There are **no page objects yet**. Every spec talks to `page` directly with raw
locators. This is intentional — it's the thing you're about to refactor away.

## Setup

```bash
npm install
npx playwright install chromium
```

## Running the tests

```bash
npm test              # headless
npm run test:headed   # watch it click through the browser
npm run report        # open the last HTML report
```

## Why this suite needs refactoring

The same problems repeat across every file:

1. **The full registration form is copy-pasted in every spec file**
   (`registration.spec.ts`, `login.spec.ts`, `accounts.spec.ts`,
   `transfer-funds.spec.ts`) — ten-plus `fill()` calls, repeated four times,
   just to reach a logged-in state.
2. **The sidebar menu locators (`#leftPanel a[href="..."]`) are duplicated**
   across `accounts.spec.ts` and `transfer-funds.spec.ts`, even though it's the
   same navigation component rendered on every authenticated page.
3. **No chaining** — nothing hands off "you're now on the accounts overview" /
   "you're now on the transfer confirmation" between steps; every test
   re-derives its starting state from raw locator calls.
4. **No shared helpers** — no common way to read a page's success/error
   message, even though ParaBank uses the same `#rightPanel`/`.error`
   convention on the register, login, and account-action pages.

## The refactor task

Restructure this into:

```
tests/
├── pages/
│   ├── BasePage.ts               # shared waits, error/success message reading
│   ├── RegistrationPage.ts       # returns AccountsOverviewPage on success
│   ├── LoginPage.ts              # returns AccountsOverviewPage on success
│   ├── AccountsOverviewPage.ts   # returns OpenAccountPage / TransferFundsPage via the sidebar
│   ├── OpenAccountPage.ts        # returns AccountsOverviewPage once opened
│   └── TransferFundsPage.ts      # returns a transfer-confirmation state
├── components/
│   └── SidebarMenuComponent.ts   # left nav — used by every logged-in page
├── registration.spec.ts
├── login.spec.ts
├── accounts.spec.ts
└── transfer-funds.spec.ts
```

### `BasePage`
Shared helpers every page object needs: constructor taking `page: Page`, plus
something like `getSuccessMessage()` / `getErrorMessage()` since ParaBank reuses
`#rightPanel p` / `.error` across register, login, and account-action outcomes.

### Chained page objects
Each action that navigates returns the **next** page object:

```ts
class LoginPage extends BasePage {
  async loginAs(username: string, password: string): Promise<AccountsOverviewPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    return new AccountsOverviewPage(this.page);
  }
}
```

So a spec can read as a fluent flow:

```ts
const overviewPage = await loginPage.loginAs(username, password);
const openAccountPage = await overviewPage.sidebar.goToOpenAccount();
const overviewAgain = await openAccountPage.openAccount('SAVINGS');
const transferPage = await overviewAgain.sidebar.goToTransferFunds();
```

### One component object: `SidebarMenuComponent`
The `#leftPanel` navigation (Accounts Overview / Open New Account / Transfer
Funds / Bill Pay / Log Out) renders on every authenticated page. Model it once,
compose it into each logged-in page object as `this.sidebar`, and have its
navigation methods (`goToTransferFunds()`, `logOut()`, etc.) return the next
page object — rather than repeating `#leftPanel a[href="..."]` locators in
`AccountsOverviewPage` and `TransferFundsPage` separately.

### Suggested order of work
1. Write `BasePage`.
2. Write `RegistrationPage` (it's the one page every test currently starts
   from) so you can immediately delete the duplicated form-filling.
3. Write `SidebarMenuComponent` and wire it into `AccountsOverviewPage`.
4. Write `LoginPage`, migrate `login.spec.ts`.
5. Write `OpenAccountPage` and `TransferFundsPage`, chaining them off the
   sidebar; migrate `accounts.spec.ts` and `transfer-funds.spec.ts`.
6. Delete the duplicated raw locators from the specs — they should end up only
   calling page object / component methods, no `page.locator(...)` left
   directly in spec files.

## Suggested git workflow

```bash
git init
git add .
git commit -m "chore: pre-refactor flat Playwright suite (baseline)"

# ... do the POM refactor ...

git add .
git commit -m "refactor: layered POM (BasePage + chained pages + SidebarMenuComponent)"
git diff HEAD~1 HEAD   # review the refactor diff
```
