Playwright Automation Standards
## Locator Strategy – Priority Order
1.	data-testid attributes (most preferred)
2.	ARIA roles and labels (role="button", aria-label="Submit")
3.	Semantic HTML elements (input[name="amount"], input[type="submit"])
4.	CSS class selectors (avoid – fragile under UI changes)
5.	XPath (avoid – last resort only)
## Assertion Standards – Always Assert Specifically
•	After any successful operation: assert the exact success message text for that operation
•	After any failed operation: assert the exact error or validation message text
•	After any financial transaction: assert the updated balance value with numeric precision
•	After any account operation: assert the account number or account detail in the response
•	After navigation: assert the page URL or page heading to confirm correct destination
•	Never use: expect(something).toBeVisible() alone – always check the content
## Framework Structure
•	Reuse a shared login helper fixture across all spec files
•	never repeat login steps
•	Store ALL test data in /test-data/<feature-name>.json – never hardcode in spec files
•	One spec file per feature: /tests/<feature-name>.spec.ts

## Wait Strategy
•	Use Playwright auto-waiting – never use page.waitForTimeout()
•	For dynamic content (dropdowns, loaded values): use expect(locator).toBeVisible()
•	For network responses (account data loading): use page.waitForResponse()
## Stability Rules
•	All selectors must work across test runs and across different account states
•	Never depend on test execution order – every test sets up its own preconditions
•	Always perform login and navigation within the test fixture, not assumed from prior tests
## Reporting Standards
•	Capture screenshot on test failure using: test.afterEach hooks
•	Log test action names at each major step for traceability
•	Save screenshots to: /test-results/screenshots/<test-name>.png

## Banking Domain Assertion Rules – Apply to All Features
•	Always assert the EXACT success message for each operation:
Transfer Funds $\rightarrow$ "Transfer Complete!"
Open Account $\rightarrow$ assert the new account number appears in the confirmation
Bill Payment $\rightarrow$ assert payment confirmation with payee name and amount
Login $\rightarrow$ assert redirect to /overview and user greeting
•	For any operation that changes a balance: assert the numeric value with full precision (e.g. $450.00 not just $450 – cents matter in financial applications)
•	For any operation that creates a record: assert the record appears in the relevant history page
•	For any operation that FAILS: assert NO record was created and NO balance changed
