const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Testinen',
        username: 'playwright',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Another Tester',
        username: 'different',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'playwright', 'salainen')

      await expect(page.getByText('Testi Testinen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) =>{
      await loginWith(page, 'playwright', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Testi Testinen logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'playwright', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Toimiiko testit?', 'playwright', 'www.toimiiko-testit.com')

      const infoDiv = page.locator('.info')
      await expect(infoDiv).toContainText('a new blog Toimiiko testit? by playwright added')
      await expect(infoDiv).toHaveCSS('border-style', 'solid')
      await expect(infoDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      await expect(page.getByText('Toimiiko testit? playwright')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'jotain muuta', 'playwright', 'www.toimiiko-testit.com')
      })
  
      test('it can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('it can be removed', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Toimiiko testit? playwright')).not.toBeVisible()
      })

      test('only creator can see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'different', 'salainen')

        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByText('remove')).not.toBeVisible()
      })
    })
      
    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'jotain muuta', 'playwright', 'www.toimiiko-testit.com')
        await createBlog(page, 'suosituin', 'playwright', 'www.toimiiko-testit.com')
      })

      test('blogs are ordered based on likes', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).nth(1).click()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'hide' }).click()

        const blogTitles = await page.locator('.blog')

        await expect(blogTitles).toHaveText([
          'suosituin playwrightview',
          'jotain muuta playwrightview',
        ]);
      })
    })
  })
})