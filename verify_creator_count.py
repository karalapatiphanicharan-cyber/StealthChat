import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to home
        await page.goto("http://localhost:5173")

        # Create room
        await page.click("text=Create Room")
        # await page.fill("input[placeholder='Enter your nickname']", "Alice")
        await page.fill("input[placeholder='Enter nickname...']", "Alice")
        await page.click("button:has-text('Create Room')")

        # Wait for Room page
        await page.wait_for_url("**/room/*")

        # Check participant count
        # Wait a bit for socket connection and join
        await page.wait_for_timeout(2000)

        count_element = page.locator("text=/1 / 15/")
        is_visible = await count_element.is_visible()

        if is_visible:
            print("SUCCESS: Creator sees 1 / 15")
        else:
            content = await page.content()
            print("FAILURE: Creator does not see 1 / 15")
            # Get text of specific element if possible
            participants_text = await page.locator("div:has-text('Participants')").inner_text()
            print(f"Participants section text: {participants_text}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
