# BLOOM — current build and activation remaining

The storefront is branded BLOOM in Arabic and English. Catalogue, cart, cards, header, WhatsApp messages and customer account preview use the new name. Existing browser basket data is retained.

Implemented locally: persistent floating WhatsApp support, header account entry, cart-to-phone modal, Gulf dialling codes, preview OTP screen, current/past example orders and order/payment/delivery timeline. Phone data is neither transmitted nor stored. No account is created, and example orders are explicitly labelled. The cart remains intact throughout the preview.

At the owner's request, actual OTP, customer sessions, order history and live tracking are deferred until hosting and domain setup. Activation needs an SMS authentication provider; server-side sessions; a database isolating each customer's orders; trusted server-side order totals; store administration for manual payment confirmation; shipping status updates or carrier webhooks. No online payment gateway is currently required: payment remains arranged outside the site. Never mark payment received or shipment delivered from a visitor-controlled action.

Card motion repair: the settle tween previously overwrote the same y/rotation properties owned by the idle tween. It now pauses the idle tween without killing it, uses a non-overwriting settle, and invalidates/restarts idle motion on pointer/focus exit. Text remains unrotated during idle motion. Reduced-motion preferences remain respected.

Validation: Arabic/English account UI; checkout opens phone, sample phone advances to explicitly disconnected OTP, current/past preview switch, basket retained; visible card y transforms changed across observations; no console errors. No message was sent and no payment/order was created.

V16 visual refinement: catalogue is now 4 columns at >=1000px, 3 at 900–999px and 2 on smaller screens. Desktop cards are 326px high (previously 490px); narrow cards are 306px. Product details stay inside a scrollable back face, retaining all information. Repeating image float, border glow and periodic sheen respect motion preferences.

Order dashboard now has a shared stage state driving its illuminated path, moving beacon, detail text, payment and delivery examples, and stage range. Click stages, adjust the slider or play the clearly labelled simulation. The simulation stops on completion, navigation or closing the dialog. No real order is changed. Browser verified stage 4 via keyboard End, matching Delivered text and range value, and completion of the automated simulation. Live provider integration remains deferred.

V17: added a separate colour-only theme stylesheet and persistent light/dark switch. Dark uses black and warm gold; light uses ivory/white surfaces and dark gold. Fonts, card geometry, flip logic, basket state and tracking state are not rebuilt when switching. Theme preference is loaded before rendering and retained on reload. Browser verified both palettes, light card-back contrast, tracker state in light mode, persistence on reload and identical card widths/heights/font family/font size in both themes. No console errors. The switch floats above support and does not add width to the header.
