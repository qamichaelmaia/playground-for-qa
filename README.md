# QA Automation Playground

A real-world playground for QA engineers to practice UI and API test automation with Playwright, Cypress, Selenium, and more.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── playground/        # Interactive playground
│   └── scenarios/         # Practice scenarios
├── components/
│   ├── ui/                # Design system components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── layout/            # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
```

## 🎨 Design System

### Colors
- Primary Glow: `#FF6803`
- Secondary Glow: `#AE3A02`
- Neutral Light: `#BFBFBF`
- Neutral Dark: `#0B0501`
- White: `#FFFFFF`

### Typography
- Font: Inter (fallback for PP Neue Montreal)
- Display: 56px/64px
- H1: 40px/48px
- H2: 28px/36px
- Body: 16px/24px

## 🧪 Test Automation Practice

### Available Test IDs

All interactive elements have `data-testid` attributes for easy targeting:

#### Login Page
- `login-email` - Email input
- `login-password` - Password input
- `login-submit` - Submit button
- `toggle-password` - Show/hide password
- `remember-me` - Remember me checkbox

#### Playground Page
- `click-button` - Click counter button
- `double-click-button` - Double click button
- `right-click-button` - Right click button
- `text-input` - Text input field
- `select-input` - Select dropdown
- `checkbox-*` - Checkbox inputs
- `radio-*` - Radio buttons
- `toggle-switch` - Toggle switch
- `dropdown-trigger` - Custom dropdown
- `dropzone` - File upload area
- `file-input` - File input
- `sortable-list` - Drag and drop list
- `users-table` - Data table
- `table-search` - Table search
- `toast` - Toast notification

### Test Credentials (Demo)
- Email: `test@example.com`
- Password: `password123`

## 🛠️ Framework Examples

### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email').fill('test@example.com');
  await page.getByTestId('login-password').fill('password123');
  await page.getByTestId('login-submit').click();
});

test('click counter', async ({ page }) => {
  await page.goto('/playground');
  const button = page.getByTestId('click-button');
  await button.click();
  await expect(button).toContainText('(1)');
});
```

### Cypress
```javascript
describe('Login Flow', () => {
  it('should login with valid credentials', () => {
    cy.visit('/login');
    cy.getByTestId('login-email').type('test@example.com');
    cy.getByTestId('login-password').type('password123');
    cy.getByTestId('login-submit').click();
  });
});

// Add custom command for data-testid
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});
```

### Selenium (Python)
```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("http://localhost:3000/login")

email_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]')
email_input.send_keys("test@example.com")

password_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]')
password_input.send_keys("password123")

submit_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]')
submit_button.click()
```

## 📄 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with features overview |
| Login | `/login` | Form validation practice |
| Register | `/register` | Password requirements, terms checkbox |
| Playground | `/playground` | Interactive elements for automation |
| Scenarios | `/scenarios` | List of practice scenarios |

## 📝 License

MIT License - feel free to use for learning and practice.
