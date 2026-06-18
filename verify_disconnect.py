import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Alice creates room
        context1 = await browser.new_context()
        page1 = await context1.new_page()
        await page1.goto("http://localhost:5173")
        await page1.click("button:has-text('Create Room')")
        await page1.fill("input[placeholder='Enter nickname...']", "Alice")
        await page1.click("button:has-text('Create Room')")
        await page1.wait_for_url("**/room/*")
        room_code = page1.url.split("/")[-1]
        print(f"Alice created room {room_code}")

        # Bob joins via /join
        context2 = await browser.new_context()
        page2 = await context2.new_page()
        await page2.goto("http://localhost:5173/join")
        await page2.fill("input[placeholder='Enter nickname...']", "Bob")
        await page2.fill("input[placeholder='Enter room code...']", room_code)
        await page2.click("button:has-text('Join Room')")
        await page2.wait_for_url(f"**/room/{room_code}")
        print("Bob joined")

        # Wait for Alice to see Bob
        print("Waiting for Alice to see 2 / 15...")
        await page1.wait_for_function("() => document.body.innerText.includes('2 / 15')", timeout=15000)
        print("Alice sees Bob joined (2 / 15)")

        # Bob disconnects
        await context2.close()
        print("Bob closed his context")

        # Wait for Alice to see Bob left
        print("Waiting for Alice to see 1 / 15...")
        await page1.wait_for_function("() => document.body.innerText.includes('1 / 15')", timeout=15000)
        print("SUCCESS: Alice sees Bob left (1 / 15)")

        # Check system message
        print("Checking for system message...")
        # Search for Bob left the room. (case sensitive or use lowercase in includes)
        await page1.wait_for_function("() => document.body.innerText.toLowerCase().includes('bob left the room.')", timeout=15000)
        print("SUCCESS: System message 'Bob left the room.' is visible")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
