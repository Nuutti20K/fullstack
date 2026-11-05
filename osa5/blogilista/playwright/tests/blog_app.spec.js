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

  test('blog list is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'blogs', level: 2 })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'playwright', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) =>{
      await loginWith(page, 'playwright', 'wrong')

      await expect(page.getByText('wrong username or password')).toBeVisible()

      await expect(page.getByText('Testi Testinen logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'playwright', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Toimiiko testit?', 'playwright', 'www.toimiiko-testit.com')

      await expect(page.getByText('a new blog Toimiiko testit? by playwright added')).toBeVisible()

      await expect(page.getByRole('link', { name: 'Toimiiko testit?' })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'jotain muuta', 'playwright', 'www.toimiiko-testit.com')
      })
  
      test('it can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'jotain muuta' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('it can be removed', async ({ page }) => {
        await page.getByRole('link', { name: 'jotain muuta' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByRole('link', { name: 'jotain muuta' })).toHaveCount(0)
      })

      test('only creator can see remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'different', 'salainen')

        await page.getByRole('link', { name: 'jotain muuta' }).click()

        await expect(page.getByText('remove')).not.toBeVisible()
      })
    })
      
//    describe('and multiple blogs exist', () => {
//      beforeEach(async ({ page }) => {
//        await createBlog(page, 'jotain muuta', 'playwright', 'www.toimiiko-testit.com')
//        await createBlog(page, 'suosituin', 'playwright', 'www.toimiiko-testit.com')
//      })
//
//      test('blogs are ordered based on likes', async ({ page }) => {
//        await page.getByRole('button', { name: 'view' }).nth(1).click()
//
//        await page.getByRole('button', { name: 'like' }).click()
//        await expect(page.getByText('likes 1')).toBeVisible()
//        await page.getByRole('button', { name: 'hide' }).click()
//
//        const blogTitles = await page.locator('.blog')
//
//        await expect(blogTitles).toHaveText([
//          'suosituin playwrightview',
//          'jotain muuta playwrightview',
//        ]);
//      })
//    })
  })
})