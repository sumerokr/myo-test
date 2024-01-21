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

test('Creates Vue app', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('#app > *').count()).toBeGreaterThan(0);
});

test('Renders spinner while loading users', async ({ page }) => {
  await page.route('**/api/users', async (route) => {
    // TODO: to be improved
    // immediate response will not show spinner, since Vue has no time to render it
    await new Promise((resolve) => setTimeout(resolve, 300));
    return route.fulfill({
      status: 200,
      json: [],
    });
  });

  await page.goto('/');

  await expect(page.getByTestId('get-users-loading')).toBeVisible();
});

test('Renders error when unable to fetch users', async ({ page }) => {
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

test('Renders empty screen message when the user list is empty', async ({ page }) => {
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

test('Renders user list when users are loaded', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('user-list')).toBeVisible();
});

test('Shows edit popup when editing a user', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('edit-user').first().click();

  await expect(page.getByTestId('edit-form')).toBeVisible();
});

test('Does not submit the form when the username is missing', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('edit-user').first().click();
  await page.getByTestId('edit-form').getByLabel('username').fill('');
  await page.getByTestId('edit-form-submit').click();

  await expect(page.getByTestId('edit-form')).toBeVisible();
});

test('Shows error when unable to update a user', async ({ page }) => {
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

test('Applies changes to the edited user', async ({ page }) => {
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

test('Removes a user from the list', async ({ page }) => {
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
