import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5173")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="home.png")
        print("Screenshot saved to home.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
