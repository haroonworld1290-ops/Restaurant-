"use strict";
/* ===== EDIT HERE ===== */
const WHATSAPP = "923007861073";
const RESTAURANT = "Ahmad Food Point & Fish Corner";
// Replace with the exact Google Maps share link once the owner confirms the location pin.
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Ahmad Food Point & Fish Corner, Daroghe Wala, Lahore");
// Unsplash photo IDs (free to use under the Unsplash License). Swap any ID, or point to your own files, to change a photo.
const IMG = {
  hero:"photo-1534797258760-1bd2cc95a5bd", bbq:"photo-1616252980327-ec70572e5df9", bbq3:"photo-1555939594-58d7cb561ad1",
  fish:"photo-1556814901-18c866c057da", fish2:"photo-1519708227418-c8fd9a32b7a2", fish3:"photo-1761950190821-970680100a22",
  chicken:"photo-1712579733874-c3a79f0f9d12", paratha:"photo-1788538397295-41114c76044d"
};
const photo = (k, w) => `https://images.unsplash.com/${IMG[k]}?auto=format&fit=crop&w=${w}&q=70`;
// price:null means "Contact for Price". Only the five paratha prices are confirmed.
const MENU = [
  {id:"f1",cat:"Fish",name:"Fish",desc:"Fish dishes from our Fish Corner. Ask us what is available.",price:null,img:"fish",alt:"Fish being grilled over a flame"},
  {id:"b1",cat:"BBQ",name:"BBQ",desc:"BBQ from our grill. Ask us what is available.",price:null,img:"bbq",alt:"Grilled meat on a black charcoal grill"},
  {id:"c1",cat:"Chicken",name:"Chicken",desc:"Chicken dishes from our kitchen and grill. Ask us what is available.",price:null,img:"chicken",alt:"A whole chicken cooking on a grill"},
  {id:"p1",cat:"Paratha",name:"Saada Paratha",price:60,img:"paratha",s:1.15,o:"20% 30%"},
  {id:"p2",cat:"Paratha",name:"Anda Paratha",price:120,img:"paratha",s:1.5,o:"75% 35%"},
  {id:"p3",cat:"Paratha",name:"Aloo Paratha",price:100,img:"paratha",s:1.9,o:"30% 70%"},
  {id:"p4",cat:"Paratha",name:"Chicken Paratha",price:200,img:"paratha",s:1.3,o:"80% 65%"},
  {id:"p5",cat:"Paratha",name:"Chicken Cheese Paratha",price:300,img:"paratha",s:1,o:"50% 50%"}
];
const CATS = ["All Items","Fish","BBQ","Chicken","Paratha"];
const GALLERY = [["fish2","Grilled fish","Grilled fish on a dark plate"],["bbq","From the grill","Grilled meat on a charcoal grill"],["chicken","Chicken on the grill","A whole chicken cooking on a grill"],
  ["paratha","Paratha","A stuffed paratha with butter"],["fish3","Fish over the flame","Fish grilling on a metal rack"],["bbq3","Grilled meat and vegetables","Grilled meat and vegetables on a table"],["fish","Fish on the grill","Fish being grilled"]];
/* ===== END EDIT ===== */

const $ = id => document.getElementById(id);
const rs = n => "Rs. " + n.toLocaleString("en-PK");
const waLink = text => `https://wa.me/${WHATSAPP}?text=` + encodeURIComponent(text);
const cart = new Map(); let active = "All Items";

/* photos: every slot has a designed fallback behind it, so a failed image never shows a broken icon */
function slot(k, w, alt, extra = "") { return `<img src="${photo(k, w)}" alt="${alt}" loading="lazy" decoding="async"${extra}>`; }
function hydrate(root = document) {
  root.querySelectorAll("[data-img]:not([data-done])").forEach(el => { el.dataset.done = 1; el.insertAdjacentHTML("beforeend", slot(el.dataset.img, +el.dataset.w || 800, el.dataset.alt || "")); });
}
addEventListener("error", e => { const t = e.target; if (t && t.tagName === "IMG") { const p = t.closest(".ph"); if (p) p.classList.add("bad"); } }, true);
function checkImgs() {
  document.querySelectorAll(".ph img").forEach(i => {
    if (i.complete && i.naturalWidth > 0) {
      i.closest(".ph")?.classList.remove("bad");
    }
  });
}
/* nav */
const nav = $("nav"), links = $("links"), burger = $("burger");
addEventListener("scroll", () => nav.classList.toggle("stuck", scrollY > 30), {passive:true});
burger.onclick = () => { const o = links.classList.toggle("show"); burger.setAttribute("aria-expanded", o); };
links.onclick = e => { if (e.target.closest("a")) { links.classList.remove("show"); burger.setAttribute("aria-expanded", false); } };
$("dir").href = MAPS_URL;
$("heroWa").href = waLink(`Hello ${RESTAURANT}, I would like to place an order.`);

/* menu */
function renderFilters() { $("filters").innerHTML = CATS.map(c => `<button class="chip" aria-pressed="${c === active}" data-c="${c}">${c}</button>`).join(""); }
function renderMenu() {
  $("menu-list").innerHTML = MENU.filter(m => active === "All Items" || m.cat === active).map(m => `
    <article class="mi"><div class="ph" data-label="${m.cat}">${slot(m.img, 600, m.alt || m.name + " paratha", m.s ? ` style="--s:${m.s};--o:${m.o}"` : "")}</div>
    <div class="mi-b"><span class="tag">${m.cat}</span><h3>${m.name}</h3>${m.desc ? `<p>${m.desc}</p>` : ""}
      <div class="mi-f">${m.price === null ? `<span class="price ask">Contact for Price</span>` : `<span class="price">${rs(m.price)}</span>`}
      <button class="add" data-id="${m.id}" aria-label="Add ${m.name} to order">Add to order</button>
      ${m.price === null ? `<a class="ask-link" target="_blank" rel="noopener" href="${waLink(`Hello ${RESTAURANT}, what is the price of your ${m.name.toLowerCase()} dishes?`)}">Ask price on WhatsApp</a>` : ""}</div></div></article>`).join("");
  setTimeout(checkImgs, 1500);
}
function setCat(c) { active = c; renderFilters(); renderMenu(); }
$("filters").onclick = e => { const b = e.target.closest(".chip"); if (b) setCat(b.dataset.c); };
document.querySelectorAll(".cat").forEach(b => b.onclick = () => { setCat(b.dataset.cat); $("menu").scrollIntoView(); });
$("menu-list").onclick = e => {
  const b = e.target.closest(".add"); if (!b) return;
  cart.set(b.dataset.id, (cart.get(b.dataset.id) || 0) + 1); renderCart();
  b.classList.add("done"); b.textContent = "Added"; setTimeout(() => { b.classList.remove("done"); b.textContent = "Add to order"; }, 900);
};

/* cart */
const find = id => MENU.find(m => m.id === id);
const priced = () => [...cart].reduce((s, [id, q]) => s + (find(id).price ?? 0) * q, 0);
const hasAsk = () => [...cart.keys()].some(id => find(id).price === null);
function renderCart() {
  const n = [...cart.values()].reduce((a, b) => a + b, 0);
  $("count").textContent = n || "";
  $("lines").innerHTML = n ? [...cart].map(([id, q]) => { const m = find(id); return `
    <div class="line"><b>${m.name}</b><span class="lp">${m.price === null ? "Contact for Price" : rs(m.price * q)}</span>
    <div class="qty"><button data-a="dec" data-id="${id}" aria-label="Decrease ${m.name}">&minus;</button><span>${q}</span><button data-a="inc" data-id="${id}" aria-label="Increase ${m.name}">+</button></div>
    <button class="rm" data-a="rm" data-id="${id}">Remove</button></div>`; }).join("") : `<p class="empty">Your order is empty. Add something from the menu.</p>`;
  const only = n && priced() === 0 && hasAsk();
  $("total").innerHTML = only ? "Contact for Price" : rs(priced()) + (hasAsk() ? `<small>plus items marked Contact for Price</small>` : "");
  $("checkout").disabled = !n; $("clear").hidden = !n;
}
$("lines").onclick = e => {
  const b = e.target.closest("[data-a]"); if (!b) return; const id = b.dataset.id, q = cart.get(id);
  if (b.dataset.a === "inc") cart.set(id, q + 1); else if (b.dataset.a === "dec") { q > 1 ? cart.set(id, q - 1) : cart.delete(id); } else cart.delete(id);
  renderCart();
};
$("clear").onclick = () => { cart.clear(); renderCart(); };
const drawer = $("drawer"), veil = $("veil");
function toggleCart(open) {
  drawer.classList.toggle("on", open); veil.classList.toggle("show", open); drawer.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : ""; (open ? $("closeCart") : $("openCart")).focus();
}
$("openCart").onclick = () => toggleCart(true); $("closeCart").onclick = veil.onclick = () => toggleCart(false);
$("checkout").onclick = () => {
  if (!cart.size) return; const name = $("name").value.trim();
  if (!name) { $("err").textContent = "Please enter your name so we can confirm your order."; $("name").focus(); return; }
  $("err").textContent = "";
  const phone = $("phone").value.trim(), notes = $("notes").value.trim(), type = document.querySelector("input[name=type]:checked").value;
  const items = [...cart].map(([id, q], i) => { const m = find(id);
    return m.price === null ? `${i + 1}. ${m.name} x ${q} (price: Contact for Price)` : `${i + 1}. ${m.name} x ${q} @ ${rs(m.price)} = ${rs(m.price * q)}`; }).join("\n");
  const total = hasAsk() ? `Total (confirmed prices only): ${rs(priced())}\nItems marked "Contact for Price" will be priced by the restaurant.` : `Total: ${rs(priced())}`;
  const msg = `Restaurant: ${RESTAURANT}\n\nOrder Items:\n${items}\n\n${total}\n\nCustomer Name: ${name}\n` + (phone ? `Phone: ${phone}\n` : "") + `Order Type: ${type}\n` + (notes ? `Instructions: ${notes}\n` : "");
  window.open(waLink(msg), "_blank", "noopener");
};

/* gallery + lightbox */
$("gal").innerHTML = GALLERY.map(([k, cap, alt], i) => `<button class="g g${i + 1} rv" data-i="${i}" aria-label="Open photo: ${cap}"><div class="ph" data-label="${cap}">${slot(k, i === 0 ? 1100 : 700, alt)}</div><span>${cap}</span></button>`).join("");
const lb = $("lb"); let cur = 0;
function show(i) { cur = (i + GALLERY.length) % GALLERY.length; const [k, cap, alt] = GALLERY[cur], im = $("lbImg");
  im.hidden = false; im.src = photo(k, 1600); im.alt = alt; $("lbCap").textContent = cap; }
$("gal").onclick = e => { const b = e.target.closest(".g"); if (b) { show(+b.dataset.i); lb.classList.add("show"); document.body.style.overflow = "hidden"; $("lbX").focus(); } };
const closeLb = () => { lb.classList.remove("show"); document.body.style.overflow = ""; };
$("lbX").onclick = closeLb; $("lbP").onclick = () => show(cur - 1); $("lbN").onclick = () => show(cur + 1); lb.onclick = e => { if (e.target === lb) closeLb(); };
$("lbImg").onerror = () => { $("lbImg").hidden = true; };
addEventListener("keydown", e => {
  if (e.key === "Escape") { closeLb(); if (drawer.classList.contains("on")) toggleCart(false); }
  if (lb.classList.contains("show")) { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); }
});

hydrate(); renderFilters(); renderMenu(); renderCart(); setTimeout(checkImgs, 1500);
document.documentElement.classList.add("js");
const rvs = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.1});
  rvs.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });
} else rvs.forEach(el => el.classList.add("in"));
