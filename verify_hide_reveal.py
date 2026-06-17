import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Increase timeout
        page.set_default_timeout(60000)

        print("Navigating to home...")
        await page.goto("http://localhost:5173")

        print("Waiting for Create Room button...")
        # Use more specific selector if possible
        create_btn = page.locator("button:has-text('Create Room')").first
        await create_btn.wait_for()
        await create_btn.click()

        print("Filling nickname...")
        await page.fill("input[placeholder='Enter nickname...']", "Alice")
        await page.click("button:has-text('Create Room')")

        print("Waiting for Room page...")
        await page.wait_for_url("**/room/*")
        await page.wait_for_timeout(2000)

        # Check if hidden
        code_text = await page.locator("h2.text-accent").inner_text()
        print(f"Initial code text: {code_text}")
        if "••••••" in code_text:
            print("SUCCESS: Room code is hidden by default")
        else:
            print("FAILURE: Room code is NOT hidden by default")

        # Click reveal
        print("Clicking reveal...")
        await page.click("button[aria-label='Reveal Room Code']")
        await page.wait_for_timeout(1000)

        code_text = await page.locator("h2.text-accent").inner_text()
        print(f"Revealed code text: {code_text}")
        if "••••••" not in code_text and len(code_text.strip()) == 6:
            print("SUCCESS: Room code is revealed")
        else:
            print("FAILURE: Room code is NOT revealed correctly")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
