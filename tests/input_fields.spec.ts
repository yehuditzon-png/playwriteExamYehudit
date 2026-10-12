import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Edit pet type name and revert it back', async ({ page }) => {
  // 1. Select the PET TYPES menu item in the navigation bar
  await page.getByRole('link', { name: 'Pet Types' }).click();

  // 2. Assert the "Pet Types" text is displayed above the table
  await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();

  // 3. Wait for table rows to load, read the current first pet type value
  const firstInput = page.locator('input[name="pettype_name"]').first();
  await expect(firstInput).toBeVisible();
  const originalName = await firstInput.inputValue();

  // 4. Click "Edit" for the first row
  await firstInput.locator('xpath=ancestor::tr[1]').getByRole('button', { name: 'Edit' }).click();

  // 5. Assert the "Edit Pet Type" text is displayed
  await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
  await expect (page.getByRole('textbox')).toHaveValue('cat')
  await page.locator('#name').fill('rabbit');
  await page.getByRole('button', { name: 'Update' }).click();

  // 7. Back on the list, wait for tbody to reload then verify "rabbit" appears
  await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
  const updatedInput = page.locator('input[name="pettype_name"]').first();
  await expect(updatedInput).toHaveValue('rabbit');

  // 8. Click "Edit" for the "rabbit" row
  await updatedInput.locator('xpath=ancestor::tr[1]').getByRole('button', { name: 'Edit' }).click();

  // 9. Change the pet type name back to the original value and click "Update"
  await expect(page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible();
    await expect (page.getByRole('textbox')).toHaveValue('rabbit')

  await page.locator('#name').fill(originalName);
  await page.getByRole('button', { name: 'Update' }).click();

  // 10. Back on the list, wait for tbody to reload then verify original name is restored
  await expect(page.getByRole('heading', { name: 'Pet Types' })).toBeVisible();
  await expect(page.locator('tbody tr').first()).toBeVisible();
  const restoredInput = page.locator('input[name="pettype_name"]').first();
  await expect(restoredInput).toHaveValue(originalName);
});
