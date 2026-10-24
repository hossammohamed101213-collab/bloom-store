# MASTER PROMPT — Recreate the BLOOM experience for a different subject

Copy everything below into your website-building agent. Fill in the project variables first. When possible attach the `project/beauty` folder from this archive as the visual and interaction reference.

---

You are a senior frontend engineer, motion designer and product designer. Build a complete, polished, responsive website for the project specified below. Match the structure, finish, interaction quality and two-theme behaviour of the supplied BLOOM source reference, while replacing the subject, brand, images, catalogue and copy with the new project. Deliver working code and a browser-tested local preview, not a design description or a static screenshot.

## 1. Project variables

- BRAND_NAME: [new brand]
- SUBJECT / INDUSTRY: [new topic; examples: furniture, coffee, technology, travel services]
- MODE: [product store / services catalogue / portfolio with enquiries]
- AUDIENCE: [who uses the website]
- COUNTRIES / CURRENCY: [actual supported countries and currency]
- LANGUAGES: Arabic RTL and English LTR unless explicitly changed here: [changes]
- CONTACT_PHONE / WHATSAPP: [verified number with international dialling code]
- EMAIL / SOCIAL_LINKS: [verified links only; leave missing entries unlinked]
- CATEGORIES: [3 primary categories and optional clearly temporary collections]
- CATALOGUE_DATA: [real items, prices, descriptions, images; or clearly labelled demonstration data]
- PRIMARY_ACTION: [buy / prepare a request / request a quote / contact]
- LIVE_INTEGRATIONS_AVAILABLE: [list actual configured services, or NONE]
- COMPANY_LEGAL_DETAILS: [provided legal entity/address/jurisdiction, or NOT PROVIDED]
- HOSTING / DOMAIN: [provided details, or LOCAL PREVIEW ONLY]

If a value is missing, use an explicitly labelled placeholder or demo state and keep building independent parts. Never invent contact details, social profiles, credentials, claims, verified reviews, stock availability, payments or delivery promises. Never publish or spend money without authorization.

## 2. Preserve the reference, change the subject

The supplied `project/beauty` folder contains the latest BLOOM storefront. Treat that folder as the current reference. The older website in `project/` is historical and is not the current design.

Preserve the overall layout and proven interaction patterns. Do not redesign sections that already work simply because you prefer another style. Re-skin the content for the new subject through data and scoped components. Retain existing routes and component contracts where possible. Read the existing modules before changing them. Keep a backup and a concise change log.

The current reference is a frontend preview. OTP, customer accounts, real orders, payment reconciliation, carrier tracking, public reviews and official support tickets are not connected. Do not present these as working backend services unless you actually implement and verify them.

## 3. Visual system and typography

Provide two complete themes with an accessible toggle and remembered preference:

1. Glossy black with restrained champagne-gold highlights.
2. Ivory/white with darker gold accents and strong dark text.

Use semantic CSS variables for background, surface, elevated surface, text, muted text, borders, accent and glow. Theme switching changes colours only: never font metrics, dimensions, layout, card count, visibility, basket contents or the selected order stage. Load the remembered theme before paint. Avoid a flash of the wrong theme. Keep native form controls legible in both themes.

Arabic typography must be crisp and properly connected. Prefer locally hosted Noto Sans Arabic, with its licence. Use a suitable English sans-serif. Preserve the accepted font family when editing a supplied site. Do not replace it with a decorative font. Avoid synthetic bolding, blurred text, excessive bloom, tiny text and fractional idle rotations on reading surfaces. Ensure useful contrast in both themes. Glow should support recognition without obscuring letter shapes; light-theme body text should remain dark and clear.

Keep glass and glossy effects controlled. Use fine gold borders, soft atmospheric depth, clean spacing and consistent rounded corners. Do not add meaningless geometric objects or introduce a robot unless it fits the new brief and is explicitly requested.

## 4. Header, navigation and atmosphere

- Sticky, uncluttered header: brand, core navigation, language switch, search, basket/request collection and account entry.
- Keep mobile controls inside the viewport. Use compact accessible icons where labels cannot fit, retaining aria-labels.
- A glowing horizontal reading-progress indicator at the top and a matching vertical indicator at the side. Both must use the same actual scroll percentage.
- A subtle gold cursor halo on fine-pointer devices, with the native cursor retained. No custom cursor on touch devices.
- Animate only the brand word, leaving its layout space reserved: hold, lift/fade/fly a short distance, briefly disappear, return and settle in the exact original location. Do not shift navigation or make the home link inaccessible. Respect reduced motion.
- Dark theme: restrained stars and occasional luminous falling meteors, behind all content.
- Light theme: visible champagne-gold drifting translucent orbs, luminous ribbons and fine dust particles. These must not be an opaque black canvas or an inverted screenshot.
- All background layers are non-interactive and behind content. No pointer blocking or horizontal page overflow.

## 5. Hero: five real visual compositions, not a static rectangle

Create five distinct, high-quality visual compositions from the new subject's actual categories. Use image-generation tooling for photographic/illustrated assets when useful. Make new imagery for the new subject; do not carry over cosmetics if the subject is furniture, coffee or another industry.

Prefer real transparent-alpha cutouts so the subjects sit naturally in both themes. Do not fake transparency with a black rectangle. Use complete objects, precise silhouettes, coherent materials, controlled highlights and enough safe margins. Do not put essential labels inside generated images; keep readable text in HTML.

Optimize delivery images to WebP or a comparable format, retain alpha, use appropriate dimensions and explicit image dimensions to avoid layout shifts. Preserve original generated assets separately when available. Verify the actual alpha and inspect the images against both backgrounds.

Hero requirements:
- Automatic crossfade/translation between five scenes about every 6.2 seconds.
- Coordinated category label, subtle halo colour and progress timer.
- Manual previous/next, five selection dots with accessible names, and pause/play.
- Gentle product float and restrained pointer parallax; avoid intrusive motion.
- Pause automatic movement on hover, keyboard focus, off-screen visibility, background tabs, explicit pause and reduced-motion preference.
- Clean up timers/observers when leaving the page. Manual slide selection must still work when autoplay is paused.
- Pause must preserve the current scene. Scene controls must not steal focus on automatic transitions.
- Text and calls to action remain readable and unobstructed. Adapt hero height to short desktop viewports and stack it cleanly on phones.

## 6. Catalogue / content cards

Use a compact, aligned grid. A good reference is four columns on desktop at 1000px and above, three around 900–999px, and two on ordinary phones. Fall back when a genuinely narrow screen cannot support readable cards. Current desktop reference cards are about 326px tall and mobile cards about 306px, but adapt to the new content without clipping.

Each card has:
- Front: sharp subject image, category, item name, price or appropriate meta, and a small interaction hint.
- Back: useful factual details, not empty slogans.
- Clicking the card surface turns it through a smooth 3D flip to its details; clicking again returns to the front.
- Enter/Space performs the same action; Escape restores the front. Maintain focus and make the inactive face inert.
- One persistent bottom action outside the rotating area: Add to basket / Add to request / View project, depending on MODE. It must not accidentally flip the card.
- No hidden or clipped details. If necessary give the back details a clearly scrollable area; avoid shrinking all text to unreadability.

Animate entry from beyond the viewport edge with a smooth, short stagger and controlled landing. After entry, visible cards have a restrained continuous float, periodic reflective sweep and breathing gold border. Product imagery may float slightly inside its frame. Freeze positional motion for hover, touch and keyboard focus so the item is easy to read; resume safely afterward. Do not kill the idle tween when settling the same transform properties. Avoid simultaneous competing animation owners. Pause off-screen and honour reduced motion.

Include functioning search and category filtering, understandable empty states, useful item detail routes and clearly marked demo categories where data is missing.

## 7. Basket / request collection, support and account

For a store, implement a real interactive basket UI. For services, adapt it to a collection of selected services for a quote. Do not force checkout into a portfolio.

Basket behaviour:
- Add a product thumbnail flight towards the basket, a counter response and a non-blocking confirmation preview.
- Show a physical wire/mesh basket with a handle and visible selected thumbnails inside, not just a rectangular list.
- Retain a readable list with images, names, quantity adjustments, remove buttons and correct totals.
- Persist only identifiers and validated quantities locally; recompute values from trusted catalogue data. Never store sensitive payment data.
- The primary continuation action opens the phone/account flow where relevant. Preserve the basket while navigating dialogs and themes.
- Persistent floating verified WhatsApp/customer-support link, and mobile basket access. Keep floating controls clear of navigation, primary actions and cookie notices.

Phone/account flow:
- Phone number and international country code, then OTP only; no password requirement unless the brief changes.
- If SMS/backend is not configured, provide an explicit disconnected preview. Never accept an arbitrary OTP, claim an SMS was sent, create a fake authenticated session or show sample orders as real.
- An account preview has current/past order tabs and a sophisticated order journey: placed, payment confirmed, preparing, shipped, delivered.
- One shared state controls the illuminated rail, travelling beacon, active stage, details, range control and payment/delivery panels.
- Clicking stages or dragging the range explores a clearly labelled simulation. A Play simulation control can move through stages and stop at completion.
- Never mark real payment received or delivery completed from a visitor-controlled preview action.

Live services, only if requested and configured:
- Server-verified OTP and protected sessions.
- Customer-scoped orders in a database; server validation of catalogue, totals and status transitions.
- Backend confirmation of offsite payments, or a configured payment provider if explicitly requested.
- Store administration and shipping updates/webhooks for real tracking.
- No secrets in browser code; authorization checks on every customer resource.

## 8. Reviews and customer concerns

Review section:
- A glass-like tube containing five interactive stars; animated liquid fill and a short star response when selected.
- Accessible single-select star rating, keyboard navigation, visible focus and readable rating feedback.
- Display-name input next to the rating and a name/score preview.
- Selectable chips for what the visitor enjoyed, adapted to the subject: products, ease, design, support, delivery.
- Optional review text and a review-preview action.
- No invented public testimonials or aggregate score. Without a backend, say the review is local and not published.

Customer concern section:
- Calm, well-organized visual treatment in both themes. Muted sage/peach accents may support the gold palette while maintaining readable contrast.
- Three clear steps: topic, details, review summary.
- Topic selection, optional order reference, required description with length validation.
- Render user input as text, never unsanitized HTML.
- Prepare a local summary, then a separate confirm action.
- In preview mode, confirmation generates a unique local reference such as NEWBRAND-DEMO-YYYYMMDD-RANDOM, visibly marked local/not sent. Offer copy and a user-controlled WhatsApp summary link. Do not claim the team received it.
- Persist at most minimal reference metadata, not the complaint body, and disclose it in the privacy/storage policy.
- In live mode, an official ticket number is issued by the server only after successful durable creation. Add authenticated status lookup and server-driven updates. Use idempotency to prevent duplicate tickets on retries.
- Never invent response-time guarantees.

## 9. Footer, policy pages and preferences

Use a structured reference-inspired footer: brand/newsletter, store/catalogue links, company and policies, verified social profiles, contact. Use responsive columns, with no invented emails, social URLs, licences, address or working hours. A back-to-top control should work and remain clear of floating actions.

Include independent Arabic/English routes for About, Privacy, Cookies/storage, Terms and Conditions, Cancellation/Returns, and Payment/Delivery as appropriate. Do not copy another company's legal text. Draft factual policies around the actual implementation and provided operating details. Explicitly flag missing operator/provider/sales details before commercial launch. Do not claim legal compliance that has not been established.

For a disconnected newsletter, make the form visibly a preview and do not report successful subscription or send/store the email. A live newsletter requires an actual provider and accurate consent/unsubscribe behaviour.

Provide a non-blocking cookie/storage notice with equally available essential-only, accept-all and customization actions. Essential functions remain identified. Optional analytics/marketing must be off until consent, and must not be claimed active when no tools exist. Store versioned preferences and timestamp; permit reopening from the footer and re-prompt when services/policy change. Rejection must not clear the basket. Distinguish local storage from cookies accurately.

## 10. Technical architecture and quality

When adapting the supplied project, keep it portable: static HTML/CSS/ES modules with local fonts, images and libraries; built-in Node/Python server launchers. Do not add a framework solely to replace working components. For a new project choose an appropriate maintainable stack, but preserve equivalent behaviour and portability.

Separate data, motion, theme, hero, commerce, account, tracker, community and policies into modules. Use a coherent component design; avoid endlessly appending conflicting global CSS overrides. Migrate repeated styles into semantic tokens carefully without changing approved geometry.

Avoid expensive full-screen filters, duplicated WebGL contexts, unbounded intervals and layout-thrashing scroll handlers. Use IntersectionObserver, requestAnimationFrame, transform/opacity animation and explicit cleanup. Retain native navigation, keyboard operation, form validation, reduced motion, dialog focus handling and RTL/LTR layout.

## 11. Required verification and deliverables

Inspect the rendered site in a real browser; do not claim success from source alone. Verify:
- Both themes, including card backs, forms, basket, account, tracking and footer.
- Equal card dimensions and font metrics before/after theme switching.
- Desktop, a narrow mobile viewport and a short desktop viewport; no horizontal overflow or hidden actions.
- All five hero images loaded, autoplay actually advances, manual controls and pause work.
- Card entry, continuous motion, hover/focus freeze, flip/return, and independent add action.
- Search/filter empty states; quantity/total/remove correctness; persistence and retained basket through account flow.
- Tracker range, stage selection and beacon/detail synchronization.
- Review stars via pointer and keyboard; selected chips; safe user-input rendering.
- Complaint confirmation creates different valid references for distinct submissions; no claim of external delivery in preview.
- Every footer route, cookie rejection/customization persistence and honest newsletter state.
- No console errors, missing local files, secrets, fake backend successes or unsolicited external transmissions.

Deliver the full source, local assets and licences, one-click/local run instructions, a concise status document listing working functions versus disconnected services, actual browser screenshots, and a ZIP that preserves paths. Include this master prompt with project variables filled in for the new subject. Report limitations clearly. Do not redesign accepted sections, publish, send messages, charge money, or configure paid services without the user's authorization.

Begin implementing now. Make routine design and engineering decisions autonomously. Ask only for information that blocks a real integration, while completing the independent frontend work.
