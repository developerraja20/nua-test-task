export const RETURN_POLICY = `<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Returns & Refunds | YourStore</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap');

        :root {
            --ink: #19231e;
            --muted: #657169;
            --green: #19764d;
            --soft: #eaf5ee;
            --line: #e5ebe7
        }

        * {
            box-sizing: border-box
        }

        html {
            scroll-behavior: smooth
        }

        body {
            margin: 0;
            background: #f7f9f7;
            color: var(--ink);
            font: 15px/1.7 'DM Sans', sans-serif
        }

        header,
        footer {
            background: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 max(22px, calc((100% - 1080px)/2))
        }

        header {
            height: 70px;
            border-bottom: 1px solid var(--line)
        }

        .logo {
            font: 800 22px Manrope, sans-serif;
            color: var(--ink);
            text-decoration: none
        }

        .logo span {
            color: var(--green)
        }

        .tag {
            font-size: 12px;
            color: var(--muted)
        }

        main {
            width: min(1000px, calc(100% - 40px));
            margin: auto
        }

        .hero {
            padding: 60px 0 36px;
            max-width: 720px
        }

        .eyebrow {
            color: var(--green);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin: 0
        }

        h1,
        h2 {
            font-family: Manrope, sans-serif;
            line-height: 1.3
        }

        h1 {
            font-size: clamp(36px, 5vw, 52px);
            letter-spacing: -2px;
            margin: 8px 0
        }

        .lead {
            color: #536159;
            font-size: 17px
        }

        .updated {
            font-size: 12px;
            color: #89938d
        }

        .layout {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 30px;
            padding-bottom: 70px
        }

        nav,
        article {
            background: white;
            border: 1px solid var(--line);
            border-radius: 13px
        }

        nav {
            position: sticky;
            top: 20px;
            height: max-content;
            padding: 18px 13px;
            display: flex;
            flex-direction: column;
            gap: 4px
        }

        nav b {
            font-size: 10px;
            letter-spacing: 1px;
            color: #929c96;
            margin: 0 10px 8px
        }

        nav a {
            font-size: 12px;
            color: #59665f;
            text-decoration: none;
            padding: 7px 10px;
            border-radius: 7px
        }

        nav a:hover {
            background: var(--soft);
            color: var(--green)
        }

        article {
            padding: 32px 40px;
            box-shadow: 0 8px 30px #182d2108
        }

        .notice {
            background: var(--soft);
            border-left: 3px solid var(--green);
            padding: 12px 15px;
            color: #45614f;
            font-size: 12px;
            margin-bottom: 27px
        }

        article section {
            scroll-margin-top: 20px;
            border-bottom: 1px solid var(--line);
            padding-bottom: 22px;
            margin-bottom: 24px
        }

        article section:last-child {
            border: 0;
            margin: 0;
            padding: 0
        }

        h2 {
            font-size: 18px;
            margin: 0 0 10px
        }

        article p,
        li {
            font-size: 13px;
            color: #59665f
        }

        article p {
            margin: 0 0 10px
        }

        ul {
            padding-left: 20px
        }

        .steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 15px 0
        }

        .step,
        .contact {
            border: 1px solid var(--line);
            border-radius: 9px;
            padding: 14px;
            background: #fcfdfc
        }

        .step strong,
        .step span {
            display: block
        }

        .step strong {
            font-size: 12px;
            margin: 7px 0
        }

        .step span {
            font-size: 11px;
            color: var(--muted)
        }

        .contact {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            font-size: 13px
        }

        .contact a {
            color: var(--green);
            text-decoration: none
        }

        .contact small {
            font-size: 11px;
            color: #89938d
        }

        footer {
            height: 65px;
            border-top: 1px solid var(--line);
            font-size: 11px;
            color: #89938d
        }

        @media(max-width:720px) {

            header,
            footer {
                padding: 0 18px
            }

            main {
                width: calc(100% - 32px)
            }

            .hero {
                padding: 42px 0 25px
            }

            .layout {
                grid-template-columns: 1fr;
                gap: 15px
            }

            nav {
                position: static;
                display: grid;
                grid-template-columns: repeat(2, 1fr)
            }

            nav b {
                grid-column: 1/-1
            }

            article {
                padding: 24px 20px
            }

            .steps {
                grid-template-columns: 1fr
            }
        }

        @media(prefers-reduced-motion:reduce) {
            html {
                scroll-behavior: auto
            }
        }
    </style>
</head>

<body>
    <header><a class="logo" href="#">YourStore<span>.</span></a><span class="tag">Customer Care</span></header>
    <main>
        <section class="hero">
            <p class="eyebrow">HERE TO HELP</p>
            <h1>Returns & Refunds</h1>
            <p class="lead">We want you to be happy with your purchase. Find out how to request a return, what to
                expect, and how refunds work.</p><span class="updated">Last updated: October 1, 2026</span>
        </section>
        <div class="layout">
            <nav aria-label="On this page"><b>ON THIS PAGE</b><a href="#overview">Overview</a><a
                    href="#eligibility">Return Eligibility</a><a href="#start">How to Start</a><a
                    href="#shipping">Return Shipping</a><a href="#refunds">Refunds</a><a
                    href="#exceptions">Exclusions</a><a href="#issues">Damaged or Incorrect</a><a
                    href="#contact">Contact Us</a></nav>
            <article>
                <div class="notice"><b>Store setup note:</b> This is sample policy copy. Confirm the return window, item
                    conditions, fees, and refund timing match your store and applicable law before publishing.</div>
                <section id="overview">
                    <h2>1. Overview</h2>
                    <p>If you're not satisfied with an item, you may be able to return it under the conditions below.
                        Eligibility can depend on the product type, condition, and delivery date.</p>
                    <p><b>Suggested return window:</b> Contact us within 14 days of delivery to request a return.
                        Replace this with your confirmed policy.</p>
                </section>
                <section id="eligibility">
                    <h2>2. Return Eligibility</h2>
                    <p>To be eligible, an item should generally:</p>
                    <ul>
                        <li>Be within the stated return window.</li>
                        <li>Be unused and in its original condition, with tags and packaging where applicable.</li>
                        <li>Include proof of purchase or an order number.</li>
                    </ul>
                    <p>Some products may have different conditions or may not be eligible. Check the product listing or
                        contact support before shipping an item back.</p>
                </section>
                <section id="start">
                    <h2>3. How to Start a Return</h2>
                    <div class="steps">
                        <div class="step"><span>01</span><strong>Contact our team</strong><span>Share your order number
                                and the item you want to return.</span></div>
                        <div class="step"><span>02</span><strong>Get instructions</strong><span>We'll confirm
                                eligibility and explain the return process.</span></div>
                        <div class="step"><span>03</span><strong>Send the item</strong><span>Pack it securely and follow
                                the instructions provided.</span></div>
                    </div>
                    <p>Please don't ship an item back before receiving return instructions.</p>
                </section>
                <section id="shipping">
                    <h2>4. Return Shipping</h2>
                    <p><b>Return shipping costs:</b> Specify whether your store or the customer pays return shipping,
                        and whether any handling fees apply.</p>
                    <p>We recommend using a trackable shipping method and keeping the receipt until your return is
                        resolved.</p>
                </section>
                <section id="refunds">
                    <h2>5. Refunds</h2>
                    <p>After receiving and inspecting your return, we'll notify you whether it has been approved.
                        Approved refunds are generally issued to the original payment method, subject to payment
                        provider processing times.</p>
                    <p><b>Suggested processing time:</b> Allow up to 5–10 business days after approval. Replace this
                        estimate with your actual process.</p>
                    <p>Explain here how original shipping charges, discounts, and partial returns affect the refund
                        amount.</p>
                </section>
                <section id="exceptions">
                    <h2>6. Non-Returnable Items</h2>
                    <p>List products that cannot be returned under your policy, such as personalized, made-to-order,
                        perishable, or hygiene-sensitive items, where applicable and legally permitted. Disclose
                        exclusions before purchase.</p>
                </section>
                <section id="issues">
                    <h2>7. Damaged, Defective, or Incorrect Items</h2>
                    <p>If your order arrives damaged, defective, or different from what you ordered, contact us as soon
                        as possible. Include your order number, a description, and clear photos if available. We'll
                        review the issue and explain the next steps.</p>
                </section>
                <section id="contact">
                    <h2>8. Contact Us</h2>
                    <p>Need help with a return or refund? Contact our customer care team.</p>
                    <div class="contact"><b>YourStore Customer Care</b><a
                            href="mailto:support@example.com">support@example.com</a><small>Replace with your store's
                            support email and contact hours.</small></div>
                </section>
            </article>
        </div>
    </main>
    <footer><span>© 2026 YourStore. All rights reserved.</span><span>Returns & Refunds</span></footer>
</body>

</html>`;

export default RETURN_POLICY;