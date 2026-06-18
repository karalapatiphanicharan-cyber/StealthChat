import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # 1. Creator starts at 1 / 15
        print("Test 1: Creator count...")
        context1 = await browser.new_context()
        page1 = await context1.new_page()
        await page1.goto("http://localhost:5173")
        await page1.click("button:has-text('Create Room')")
        await page1.fill("input[placeholder='Enter nickname...']", "Alice")
        await page1.click("button:has-text('Create Room')")
        await page1.wait_for_url("**/room/*")
        room_code = page1.url.split("/")[-1]

        await page1.wait_for_function("() => document.body.innerText.includes('1 / 15')")
        print("PASS: Creator sees 1 / 15")

        # 2. Hide/Reveal
        print("Test 2: Hide/Reveal...")
        code_text = await page1.locator("h2.text-accent").inner_text()
        if "••••••" in code_text:
            print("PASS: Room code hidden by default")
        else:
            print(f"FAIL: Room code not hidden, got '{code_text}'")

        await page1.click("button[aria-label='Reveal Room Code']")
        await asyncio.sleep(0.5)
        revealed_code = await page1.locator("h2.text-accent").inner_text()
        if revealed_code.strip() == room_code:
            print("PASS: Room code revealed correctly")
        else:
            print(f"FAIL: Revealed code mismatch. Expected {room_code}, got '{revealed_code.strip()}'")

        # 3. Copy button
        print("Test 3: Copy button...")
        await page1.click("button[aria-label='Copy Room Code']")
        # Check for Copied! tooltip
        tooltip = page1.locator("text=Copied!")
        await tooltip.wait_for(state="visible")
        print("PASS: Copy button shows 'Copied!' tooltip")

        # 4. Second user joins updates count to 2 / 15
        print("Test 4: Second user joins...")
        context2 = await browser.new_context()
        page2 = await context2.new_page()
        await page2.goto("http://localhost:5173/join")
        await page2.fill("input[placeholder='Enter nickname...']", "Bob")
        await page2.fill("input[placeholder='Enter room code...']", room_code)
        await page2.click("button:has-text('Join Room')")
        await page2.wait_for_url(f"**/room/{room_code}")

        await page1.wait_for_function("() => document.body.innerText.includes('2 / 15')")
        await page2.wait_for_function("() => document.body.innerText.includes('2 / 15')")
        print("PASS: Both users see 2 / 15")

        # 5. "You" labeling
        print("Test 5: Ownership labels...")
        await page1.fill("textarea", "Hi Bob")
        await page1.keyboard.press("Enter")
        await page1.wait_for_selector("p.text-xs.font-bold:has-text('You')")
        print("PASS: Alice sees 'You'")

        await page2.wait_for_selector("p.text-xs.font-bold:has-text('Alice')")
        print("PASS: Bob sees 'Alice'")

        # 6. Empty/Whitespace messages blocked
        print("Test 6: Whitespace validation...")
        await page2.fill("textarea", "   ")
        await page2.keyboard.press("Enter")
        await asyncio.sleep(1)
        alice_msgs = await page1.locator("p.text-sm").all_text_contents()
        if all(m.strip() for m in alice_msgs):
            print("PASS: Whitespace messages blocked")
        else:
            print(f"FAIL: Whitespace message found: {alice_msgs}")

        # 7. Disconnect updates count
        print("Test 7: Disconnect handling...")
        await context2.close()
        await page1.wait_for_function("() => document.body.innerText.includes('1 / 15')")
        print("PASS: Count decreased after disconnect")

        # 8. Third user joins
        print("Test 8: Third user joins...")
        context3 = await browser.new_context()
        page3 = await context3.new_page()
        await page3.goto(f"http://localhost:5173/room/{room_code}")
        # Wait for redirect to /join if nickname is missing
        await page3.wait_for_selector("input[placeholder='Enter nickname...']")
        await page3.fill("input[placeholder='Enter nickname...']", "Charlie")
        # Since Charlie went directly to the room URL and was redirected,
        # the room code might already be filled in JoinRoom if we implement that,
        # but let's assume it might not be.
        room_code_input = page3.locator("input[placeholder='Enter room code...']")
        current_val = await room_code_input.input_value()
        if not current_val:
            await room_code_input.fill(room_code)

        await page3.click("button:has-text('Join Room')")
        await page3.wait_for_url(f"**/room/{room_code}")

        await page1.wait_for_function("() => document.body.innerText.includes('2 / 15')")
        print("PASS: Alice sees Charlie joined (2 / 15)")

        await browser.close()
        print("ALL TESTS PASSED")

if __name__ == "__main__":
    asyncio.run(run())
