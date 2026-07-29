# Enterprise Playwright & AI Automation Engineering Standards

This document establishes the binding framework design patterns, scripting constraints, and architectural boundaries for all human engineers and autonomous MCP Agents (Generator, Healer, and PR Review Agents).

---

## 🎭 1. Locator Strategy Hierarchy (Strict Order)

All elements must be located using user-centric and decoupling attributes. Raw HTML parsing or structural paths are heavily penalized in code review.

1. **Automation Identifiers (The Gold Standard):** Must use `page.getByTestId('element-identifier')` mapping directly to `data-testid` or `data-qa` attributes.
2. **Accessible ARIA Semantic Roles:** `page.getByRole('button', { name: 'Submit' })` or `page.getByLabel()`. Tests must mirror the user perspective and validate accessibility compliance.
3. **Semantic HTML Form Attributes:** `page.locator('input[name="amount"]')`. Used only when custom test IDs cannot be injected into the application markup.
4. **Stable CSS Class Selectors (Defensive Exception):** Allowed only as a secondary boundary layout constraint (e.g., `page.locator('.banking-form-container .submit-btn')`). 
   - **CRITICAL:** Dynamically generated utility classes (e.g., Tailwind variants, CSS modules like `css-x921a`) are strictly forbidden.
5. **XPath (Absolute Forbidden Boundary):** Absolute structural paths (e.g., `/html/body/div...`) are completely banned. Relative XPaths are restricted to last-resort table parsing layouts where sibling node text validation is mathematically required.

---

## 🏛️ 2. Framework Architecture & Dependency Injection

Framework design must implement a pure Shift-Left configuration model. Brittle inline scripts are systematically blocked at the PR Review gate.

- **Zero-Baggage Authentication:** Hardcoded login steps, UI form fills for SSO, or active `beforeEach` hooks in spec files for authorization are strictly prohibited. 
- **Session Injection:** The framework utilizes a single `global-setup.ts` to execute corporate login via API/SSO, dumps state cookies into a hidden `.auth/user.json` file, and injects it on-demand via an `authenticatedPage` or `authenticatedContext` custom fixture.
- **Data Encapsulation:** Zero hardcoded test values, dynamic accounts, or production strings are permitted in test files. All data matrices must be populated dynamically via external files located in `src/test-data/<feature-name>.json` or generated at runtime via upstream API seeding requests.
- **Atomic Isolation:** Tests must remain completely independent. Cross-test sequential execution dependencies are strictly banned. Every test is responsible for provisioning its own unique dynamic data context to prevent parallel run database collisions.
- **File Hierarchy Structure:** Enforce a strict one-to-one mapping layout:
  - Spec Suites: `tests/<domain-module>/<feature-name>.spec.ts`
  - Page Objects: `src/pages/<domain-module>/<FeaturePage>.ts`
  - Fixture Core: `src/fixtures/<layer>.fixture.ts`

---

## 🛑 3. Assertions & Validation Rules

- **Soft Assertions for Multi-Element Arrays:** When validating complex data grids, charts, or multiple dashboard widgets on a single view, engineers and agents **must** use `expect.soft()`. This prevents single visual discrepancies from terminating execution early, providing complete error logs for downstream AI healing passes.
- **Content-Driven Visibility Checks:** Do not assert basic visibility blindly (`expect(locator).toBeVisible()`) on critical nodes. Always pair visibility with exact cryptographic string data or pattern validations (e.g., `expect(locator).toHaveText(/Transaction Successful/)`).
- **Financial Precision Metrics:** After executing transfers or status mutations, financial ledger data must be asserted using exact floating-point balance evaluation models to verify numerical precision down to the last digit.
- **Explicit Target Headings:** Navigation shifts must be validated by asserting target page document titles or localized view container headings immediately upon route transition.

---

## ⏱️ 4. Wait Strategies & Asynchronous Resilience

- **Anti-Pattern Ban:** Explicit programmatic thread execution sleep statements (e.g., `page.waitForTimeout()`, `setTimeout()`) will cause an immediate failure at compile or PR review check gates.
- **Playwright Native Auto-Waiting:** Leverage native locator polling engines which automatically verify element attach states, visibility parameters, and actionability vectors prior to action processing.
- **Dynamic Content Assertions:** For asynchronously rendered component blocks, rely on web-first assertions that automatically poll the DOM (e.g., `expect(locator).toBeVisible({ timeout: 10000 })`).
- **Network Layer Anchoring:** When waiting for large transaction states, database updates, or background data processing elements, tests must use `page.waitForResponse('/api/v1/accounts/*')` to attach directly to network resolution states rather than guessing with UI delay loops.

---

## 📈 5. Pipeline Reporting & Debugging Infrastructure

- **Zero Hook Bloat:** Do not implement manual `test.afterEach` blocks or script hooks inside spec files to capture screenshots or record errors. 
- **Native Configuration Control:** System execution reporting parameters are managed globally inside `playwright.config.ts`. The framework captures system anomalies out-of-the-box using:
  - `screenshot: 'only-on-failure'`
  - `video: 'retain-on-failure'`
  - `trace: 'on-first-retry'` to generate complete contextual ZIP files for the Playwright Trace Viewer.
- **Action Logging Protocol:** Every standalone business layer page method inside your POM files must be wrapped inside an organized structural step marker (e.g., `await test.step('Submit Funds Transfer Request', async () => { ... })`) to ensure clean tracing inside Allure and HTML pipeline reports.