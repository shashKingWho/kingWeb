Yes. That style is inspired by **Bauhaus / Mid-century Modern geometric design**, and it's perfectly suitable for a privacy policy page. I'd make a few tweaks so the page is actually readable while keeping the same visual language.

I'd keep:

* 🎨 The Bauhaus color palette (`#fe3424`, `#fdbf36`, `#1e69aa`, cream, black)
* **Bebas Neue** for headings
* Thick black borders
* Geometric header mosaic
* Large color blocks
* Flat design

I'd change:

* Use a clean body font (Inter, Source Sans, or system-ui) instead of Bebas for paragraphs.
* Put the policy inside a cream "paper" card.
* Use red section numbers.
* Add small Bauhaus accent circles/squares beside headings.
* Keep plenty of whitespace since legal text is long.

Something like this:

```
┌──────────────────────────────────────────┐
│ █ ◐ ● ◧ ◑ █  BAUHAUS MOSAIC HEADER        │
├──────────────────────────────────────────┤

        PRIVACY POLICY
        [GAME NAME]

────────────────────────────────────────────

① Information We Collect
Lorem ipsum...

────────────────────────────────────────────

② Analytics & Game Services
• Unity Analytics
• Unity Gaming Services
• Epic Online Services
• Meta Quest Platform
• Crash Reporting

────────────────────────────────────────────

③ Advertising

────────────────────────────────────────────

④ Third-Party Services

────────────────────────────────────────────

© 2026
```

With CSS additions like:

```css
body{
    background:var(--cream);
    font-family:system-ui,sans-serif;
    color:var(--b4);
}

.policy{
    max-width:900px;
    margin:auto;
    background:#fffdf8;
    border:5px solid var(--b4);
    padding:50px;
}

h1,h2{
    font-family:'Bebas Neue',sans-serif;
    letter-spacing:.08em;
}

h2{
    border-bottom:4px solid var(--b4);
    padding-bottom:8px;
    margin-top:45px;
}

h2::before{
    content:"";
    display:inline-block;
    width:18px;
    height:18px;
    margin-right:12px;
    background:var(--b1);
    border:3px solid var(--b4);
    border-radius:50%;
}

a{
    color:var(--b3);
    font-weight:bold;
}

ul li{
    margin:.6rem 0;
}

footer{
    margin-top:60px;
    border-top:5px solid var(--b4);
    padding-top:20px;
    color:#555;
}
```

This gives you a page that feels like it belongs to the same visual identity as your game instead of looking like a generic legal document, while remaining easy to read.

I would **not** use the giant eye illustration from your snippet on a privacy policy page—it competes with the content. Instead, I'd reuse just the **mosaic header** and the geometric accents throughout the document. The eye artwork would work much better on your game's homepage or landing page than on a legal page.
