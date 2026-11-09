# Ahmad Food Point & Fish Corner (fresh premium build)

Static site: HTML, CSS, vanilla JS. Open `index.html` in Chrome, or host it free on GitHub Pages. No backend.

```
ahmad-food-point-premium/
├── index.html
├── css/style.css
├── js/script.js      <- WhatsApp number, map link, photo IDs and menu items are at the top
├── assets/favicon.svg
└── README.md
```

## Photos
Photos load from Unsplash (free to use under the Unsplash License), so an internet connection is needed to see them.
If any photo fails to load, its slot shows a dark gold panel with the dish name instead of a broken image icon.
To change a photo, edit the `IMG` list at the top of `js/script.js`.

Photographers: Evan Wise (hero, BBQ), Iulia Buta (BBQ), Victoria Shes (grilled meat and vegetables), Clint Bustrillos (fish),
Caroline Attwood (grilled fish), Mihály Köles (fish over flame), Sven Lippmann (chicken), Zoshua Colah (paratha).

## Menu and prices
Only the five paratha prices are confirmed. Fish, BBQ and Chicken show "Contact for Price". To add a priced item, add a line to `MENU` in `js/script.js`.

## Still to set
- `MAPS_URL` in `js/script.js`: currently opens a Google Maps search. Replace it with the exact share link of the restaurant's pin.
- Canonical URL and `og:image` in `index.html` once the domain is final.

## GitHub Pages
Create a public repo, upload the contents of this folder so `index.html` is at the root, then Settings > Pages > Deploy from a branch > `main` / root.
