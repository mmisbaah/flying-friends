# Math Market demo

A cozy, playable Sunny Fruit Stall prototype. No build or package installation needed.

Open `index.html` in a modern browser, or run `node server.cjs` and visit http://127.0.0.1:4173.

Includes nine customer missions (three per difficulty track), counting and subtraction, multiplication, totals, change, decimals, discounts, an open budget challenge, free play, spoken orders where supported, free hints, three purchasable decorations, and local progress with a grown-up summary. Use +/− buttons or tap packed fruit to remove it. Each completed order earns five reward coins. Reward coins are separate from question money.

Progress is stored in this browser’s localStorage. External Google Fonts are optional; system fonts work offline. There are no accounts, analytics, dependencies, timers, or real purchases.

Prototype scope: one shop, fixed sample missions, basic hints and learning notes. The complete 18-mission curriculum, adaptive progression, additional shops, grouping/measurement tools, and fuller accessibility/audio support remain future work.

## Mobile layout

The main game uses a viewport-sized layout with no page scrolling, with compact controls on phones and a two-column layout in landscape. Hints open in a dismissible dialog, and feedback appears as a dismissible message. Decorations are accessible from the bottom bar on mobile. Secondary dialogs can scroll if their content exceeds the screen (for example, accumulated grown-up notes).

Layout checked at 320×568, 360×640, 375×667, 390×844, 844×390, 1366×768, and 1440×900. Native mobile keyboard behavior still needs a real-device check.

## Upgrade 1 — Illustrated orders

All nine missions now have short written orders and picture cards. Explorer counting orders show individual fruit pictures; other cards show the quantities, prices, payment, discount, or budget needed for the problem without revealing the answer. Listen reads the original customer story. Free play removes the order cards. Layout verification covers all nine orders across five phone, landscape, and desktop sizes.

## Upgrade 2 — Larger fruit controls

Tap the fruit picture, name, or price to add one item. Each fruit has a separate 48×44-pixel remove button and a packed quantity. Native buttons support touch, mouse, Enter, and Space; keyboard focus is preserved when quantities update. Empty baskets disable removal, full baskets disable adding, and served orders lock both controls. Verified all nine orders, five viewport sizes, touch hit areas, and keyboard interactions.

## Upgrade 3 — A basket that teaches

Explorer orders have dotted counting spaces, separated by fruit type. Filled spaces show the packed fruit; extras and unrequested types remain visible in a separate row. The manager multiplication order displays four bags with three spaces each, filled in sequence. Fruit remains removable through the large minus controls. Free play and other payment missions keep the ordinary basket. Verified partial fills, extras, wrong fruit, subtraction, four equal groups, and no page or tray overflow at five viewport sizes.

## Upgrade 4 — Gentle, specific feedback

Order checks identify one next step: remove extra fruit first, then add the missing quantity. After a check, the message updates as the child edits the basket. Payment guidance distinguishes totals, change, and discounts; budget feedback reports the amount over budget or a missing fruit type. Feedback occupies space below the basket instead of an overlay. Work and rewards are preserved. Guided completions count as supported practice in grown-up notes. Error and success states verified for all nine missions at five viewport sizes.

## Upgrade 5 — Guided first customer

New players receive an optional welcome walkthrough. A separate practice order guides them through tapping fruit, checking six counting spaces, and serving Sunny. Highlighted controls indicate the current step; Skip and the footer’s How to play action allow exit and replay. The previous order, basket, typed answer, completion state, and feedback are restored afterward. Practice does not award coins or record learning results. Dismissal is remembered locally. Verified the three-step flow, early checks, persistence, replay/skip restoration, track switching, and five viewport sizes.

## Upgrade 6 — Small celebrations

Successful orders show a smiling customer and a thank-you. Five decorative coins briefly travel toward the reward wallet, without delaying the next order or changing reward logic. A header settings button offers optional soft synthesized chimes (off by default) and reduced motion. Preferences are saved locally, and device reduced-motion preferences always suppress moving effects. Practice orders do not trigger reward celebrations. Verified exact rewards, animation cleanup, sound initialization, persistence, reduced-motion behavior, and five viewport sizes. Actual chime playback should also be listened to on the target device.

## Upgrade 7 — Simpler navigation

The main game now presents Play, Explore, and My shop. The gear menu holds learning-track choices, learning notes, and sound/motion preferences. How to play stays available below the game. Re-selecting the current play mode preserves its basket, and opening settings or My shop does not reset an order. Track changes explicitly start a fresh order while preserving rewards. Verified every menu route, all nine customer missions, purchases, persistence, selected navigation states, and five viewport sizes.

## Upgrade 8 — Visible shop goals

A bottom-bar goal shows the chosen decoration, current coins, and remaining customers (five coins per customer). The first goal is a ten-coin plant. My shop lets players choose among unowned decorations; the choice persists locally. When affordable, the goal offers a direct route to purchase. Buying equips the decoration and advances to another unowned goal. Completing the collection shows a lasting completion message. No coins are spent automatically. Verified real earned progress, purchasing, affordability, saved choices, full collection, and all nine success states at five screen sizes.

## Upgrade 9 — Spoken help

Hints, tutorial welcomes, tutorial steps, and tutorial completion now offer explicit Listen/Stop controls. Full customer orders retain their narration. Speech cancels when the relevant screen or step changes, when dialogs close, and when leaving the page. Nothing speaks automatically, and all instructions remain readable. Unsupported browsers show an audio-unavailable state. Verified utterance text and stop/replay/completion behavior using browser speech stubs, tutorial layout at five sizes, and the nine-mission regression flow. Actual voice availability and audible output depend on the browser/device and need an on-device listen.

## Upgrade 10 — Continue where you left off

The active customer, track, basket, payment input, hint usage, and coaching feedback now resume after reload. Completed orders return with Next customer or Finish your shift and cannot award the same reward twice. Rewards and the completed marker are stored together. Explore baskets also resume. During the tutorial, autosave preserves the original game session, not the practice order. Malformed session records fall back to a fresh order without clearing coins or decorations. Storage remains local to this browser/device; no account or cloud sync is involved.

## Upgrade 11 — Explore your own prices

Explore includes a Set prices dialog with prices from 0.50 to 20 market coins, up to two decimal places. Changing prices preserves the basket and shows its previous and new total. Values persist locally and can be reset to 2, 3, and 4. Customer mission prices and rewards are unaffected. Totals use integer cents to avoid floating-point price artifacts. Verified decimal arithmetic, invalid/empty input, reset, persistence, mission isolation, and five viewport sizes.

## Upgrade 12 — Open-ended Explore budgets

Prices & budget offers optional limits of 5, 10, 15, 20, or 30 market coins. A live message shows spending, money left, exact-budget matches, and amounts over budget. Children can experiment freely; going over never removes rewards or blocks the basket. The choice persists alongside custom prices and can be switched off. Mission budgets remain separate. Verified decimal limits, over/exact/under states, corrections, persistence, invalid input, no penalty, mission isolation, and five viewport sizes.

## Unlimited random problems

Play now generates new three-customer shifts indefinitely. Explorer varies fruit counts, addition, and subtraction; Manager varies equal groups, whole-number totals, and change; Planner varies decimal prices, percentage discounts, and budget limits. Pictures, packing trays, spoken orders, explanations, and hints use the same generated values. Choose New random shift after a round, or Settings → Start a new random shift at any time. Existing unfinished legacy orders are preserved until the next shift.

Generated problems and answers are saved with the active session, so refreshing does not replace the problem or duplicate a completed reward. The tutorial still uses its six-apple example and restores the generated game afterward. These are endless combinations of the supported problem types, not a guarantee that a combination never repeats.

Verification: 9,000 generated problems checked for bounds/arithmetic and 450 orders completed across five viewport sizes, plus resume, reward, tutorial, and settings-shortcut checks. Earlier fixed-order test scripts may need updated expectations when used against random shifts.

## Learning recap after each shift

The shift summary now shows all three skills and the strategy for each generated problem. It distinguishes independent completions from work completed with hints or correction guidance, without scores or rankings. A suggested next activity revisits a supported skill when relevant. Listen reads the recap. Results persist with the generated order set, and new shifts start with fresh recap records. Verified all three tracks, mixed support usage, exact explanations, reloads, reward integrity, narration controls, and mobile/landscape dialogs. Long recap dialogs may scroll; the main game stays on one screen.

## Random selection without repeats

Each track now remembers selected mathematical questions in local browser storage. The identity includes the operation, quantities, relevant prices, payment/discount/budget, and grouping structure; story wording and unused prices do not disguise a duplicate. New shifts randomly choose and shuffle three unseen questions, allowing question types to appear in different positions. Rendering and feedback use the skill rather than the position in the shift.

The age-appropriate ranges are finite. A bounded random search that cannot find three unseen questions preserves the current shift and offers another track instead of silently recycling questions. History is retained across refreshes on this browser; clearing browser storage starts a new history. Selected but unfinished questions are also reserved against repeats. The fixed tutorial is deliberate practice and is not part of random selection.

Verification: 285 newly selected questions without duplicate identities, persistence/reload checks, the no-repeat fallback, and solving mixed shifts plus recaps at five screen sizes. This supersedes the earlier repeat-possible random-selection behavior.

## Interactive 3D market

The stall now renders as a low-poly WebGL diorama with directional lighting, 3D fruit crates, trees, a fence, a shopkeeper, and a basket that fills with packed fruit. Purchased mint awnings, plants, and cats appear in the scene. Drag to rotate the view; tap a crate or use the accessible fruit buttons to pack. The header’s 3D button opens a larger view, including on small phones. The main interface has tactile button depth and warmer game-like materials.

No external graphics packages or model downloads are required. Rendering is capped near 30 frames per second and device pixel ratio at 1.5, skips hidden tabs, respects reduced motion, and falls back to the original illustration when WebGL is unavailable. Actual performance depends on the device; verification used desktop Edge with software WebGL. Checks cover rendering, rotation, fruit packing, served-order locking, persistence, decorations, reduced motion, no-WebGL fallback, and five viewport sizes. Random-question gameplay and no-repeat selection were rechecked too.

## Full customer gameplay in 3D

The expanded 3D view now shows the current customer order, fruit prices, add/remove controls, payment input when required, and Serve/Next customer actions. It uses the main game’s validation and saved reward state. The last customer hands off to the learning recap. Tutorial users are returned to the guided main screen for the final instruction. Verified nine random orders across three tracks, incorrect answers, remove controls, reward totals, recap handoff, and five viewport sizes.

## Home → Shop → Pay

The app now opens on a Home screen with the interactive 3D stall, Continue/Open shop, Explore, decorations, and tutorial entry points. Shop focuses on the order and collecting fruit; Go to Pay checks the basket before advancing. Pay contains the receipt, payment input where needed, confirmation, and next-customer actions. Back to shop preserves the basket; Home preserves the last shop/pay step for Continue. The expanded 3D view also routes to Pay. Completed discount receipts show the discounted amount, and Explore checkout gives no reward coins.

Verified Home/Shop/Pay navigation, saved resumption, incomplete-basket guards, nine orders, tutorial return routing, Explore checkout, discount receipts, and five viewport sizes. Separate dialogs such as learning recaps can scroll; the core Shop and Pay screens are fitted to the viewport.

## Age-appropriate payment answers

Market Explorer (ages 5–7) selects the basket’s total from four distinct, shuffled coin amounts. One is correct; a choice must be checked before completing the sale. Market Manager and Planner use typed input, preserving existing total/change/discount questions and adding a typed total when an order previously had no payment question. Receipts hide the total before success. Options and selections persist with the order, and incorrect/blank answers do not earn coins. The tutorial and Explore retain their guided/free-play flows.

Verified unique choices, wrong/blank/correct answers, reward protection, answer visibility, refresh persistence, typed upper-track totals, and five viewport sizes including the smallest phone’s payment panel.

Explorer payment hints now offer an interactive counting helper: add one fruit's coins at a time, hear the current count, and return to the four choices. Hints record supported learning and keep the full five-coin reward.

Visual redesign: full-screen illustrated orchard, game title menu, brighter transparent WebGL toy stall, custom vector fruit and customer portraits, wooden packing controls, cash-register checkout, and fruit-to-basket animation. Mobile portrait/landscape, desktop, reduced motion, and no-WebGL fallback checked. Learning rules and saved progress retained.
