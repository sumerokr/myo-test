import { test, expect } from '@playwright/test';

const getUsers = () => [
  {
    createdAt: '2020-01-18T07:17:51.988Z',
    username: 'firstOne',
    profile: {
      firstName: 'Ophelia',
      lastName: 'Maggio',
      avatar: 'https://some.url/here.jpg',
    },
    id: '1',
  },
  {
    createdAt: '2024-01-18T07:17:51.988Z',
    username: 'secondOne',
    profile: {
      firstName: 'Maggio',
      lastName: 'Ophelia',
      avatar: 'https://some.url/here.jpg',
    },
    id: '2',
  },
];

test.beforeEach(async ({ context }) => {
  // Mock any network requests to GET users endpoint
  await context.route('**/api/users', (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        json: getUsers(),
      });
    }
    return route.continue();
  });
});

test('creates Vue app', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('#app > *').count()).toBeGreaterThan(0);
});

test('renders spinner while users are loading', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    // TODO: make it better
    // immediate response will not show spinner, since Vue has no time to render it
    await new Promise((resolve) => setTimeout(resolve, 100));
    return route.fulfill({
      status: 200,
      json: [],
    });
  });

  await page.goto('/');

  await expect(page.getByTestId('get-users-fetching')).toBeVisible();
});

test('renders error when cannot fetch users', async ({ page }) => {
  await page.route('**/api/users', (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 400,
      });
    }
    return route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('get-users-error')).toBeVisible();
});

test('renders empty screen when user list is empty', async ({ page }) => {
  await page.route('**/api/users', (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        json: [],
      });
    }
    return route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('empty-user-list')).toBeVisible();
});

test('renders user list when users are loaded', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('user-list')).toBeVisible();
});

test('shows edit popup when user is being edited', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('edit-user').first().click();

  await expect(page.getByTestId('edit-popup')).toBeVisible();
});

test('does not submit the form, when username is missing', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('edit-user').first().click();
  await page.getByTestId('edit-form').getByLabel('username').fill('');
  await page.getByTestId('edit-form-submit').click();

  await expect(page.getByTestId('edit-popup')).toBeVisible();
});

test('shows error when cannot update a user', async ({ page }) => {
  await page.route('**/api/users/**', (route, request) => {
    if (request.method() === 'PUT') {
      return route.fulfill({
        status: 400,
      });
    }
    return route.continue();
  });

  await page.goto('/');
  await page.getByTestId('edit-user').first().click();
  await page.getByTestId('edit-form-submit').click();

  await expect(page.getByTestId('edit-form-error')).toBeVisible();
});

test('applies changes to edited user', async ({ page }) => {
  const assertedUsername = 'new name';

  await page.route('**/api/users/**', (route, request) => {
    if (request.method() === 'PUT') {
      return route.fulfill({
        status: 200,
        json: {
          ...getUsers()[0],
          username: assertedUsername,
        },
      });
    }
    return route.continue();
  });

  await page.goto('/');
  await page.getByTestId('edit-user').first().click();
  await page.getByTestId('edit-form').getByLabel('username').fill(assertedUsername);
  await page.getByTestId('edit-form-submit').click();

  await expect(page.getByTestId('username').first()).toHaveText(assertedUsername);
});

test('removes users from list', async ({ page }) => {
  const users = getUsers();

  await page.route('**/api/users/**', (route, request) => {
    if (request.method() === 'DELETE') {
      return route.fulfill({
        status: 200,
        json: users[0],
      });
    }
    return route.continue();
  });

  await page.goto('/');

  await expect(page.getByTestId('user-card')).toHaveCount(users.length);

  await page.getByTestId('delete-user').first().click();
  await page.getByTestId('delete-confirmation-submit').click();

  await expect(page.getByTestId('user-card')).toHaveCount(users.length - 1);
});
