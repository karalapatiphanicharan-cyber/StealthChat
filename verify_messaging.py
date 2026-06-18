import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # User 1: Alice
        context1 = await browser.new_context()
        page1 = await context1.new_page()
        await page1.goto("http://localhost:5173")
        await page1.click("text=Create Room")
        await page1.fill("input[placeholder='Enter nickname...']", "Alice")
        await page1.click("button:has-text('Create Room')")
        await page1.wait_for_url("**/room/*")
        room_url = page1.url
        room_code = room_url.split("/")[-1]

        # User 2: Bob
        context2 = await browser.new_context()
        page2 = await context2.new_page()
        await page2.goto("http://localhost:5173/join")
        await page2.fill("input[placeholder='Enter nickname...']", "Bob")
        await page2.fill("input[placeholder='Enter room code...']", room_code)
        await page2.click("button:has-text('Join Room')")
        await page2.wait_for_url(f"**/room/{room_code}")

        # Alice sends message
        await page1.fill("textarea", "Hello from Alice")
        await page1.keyboard.press("Enter")

        # Check "You" for Alice
        await page1.wait_for_selector("p.text-xs.font-bold:has-text('You')")
        alice_you = await page1.locator("p.text-xs.font-bold:has-text('You')").is_visible()
        print(f"Alice sees 'You': {alice_you}")

        # Check "Alice" for Bob
        await page2.wait_for_selector("p.text-xs.font-bold:has-text('Alice')")
        bob_sees_alice = await page2.locator("p.text-xs.font-bold:has-text('Alice')").is_visible()
        print(f"Bob sees 'Alice': {bob_sees_alice}")

        # Bob sends whitespace message
        await page2.fill("textarea", "   ")
        await page2.keyboard.press("Enter")
        await page2.wait_for_timeout(1000)

        # Alice should NOT see a new message
        messages = await page1.locator("p.text-sm").all_text_contents()
        print(f"Alice messages count: {len(messages)}")
        # Filter out system messages if any (though p.text-sm is for chat messages)
        chat_messages = [m.strip() for m in messages]
        print(f"Chat messages: {chat_messages}")

        if any(not m for m in chat_messages):
             print("FAILURE: Empty or whitespace message was sent")
        else:
             print("SUCCESS: Empty/whitespace messages were blocked")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
