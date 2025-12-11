
// (async function () {
//   const container = document.getElementById("loox-reviews");
//   if (!container) return;

//   const BASE = "https://shopify-backend-pqh8.onrender.com";
//   let productId = window.__LOOX_PRODUCT_ID;

//   if (!productId) {
//     container.innerHTML = "Product ID missing.";
//     return;
//   }

//   // GID → number
//   if (typeof productId === "string" && productId.includes("gid://")) {
//     productId = productId.replace("gid://shopify/Product/", "");
//   }

//   // render reviews + button + modal
//   container.innerHTML = `
//     <div id="reviews-list">Loading reviews...</div>
//     <button id="open-review-btn" style="margin-top:8px;padding:6px 12px;">Write a Review</button>

//     <div id="review-modal" style="display:none; position:fixed; right:20px; top:80px; width:300px; z-index:9999; background:#fff; border:1px solid #ddd; padding:10px; border-radius:6px;">
//       <button id="close-review-btn" style="float:right;">✕</button>
//       <h4>Write a Review</h4>
//       <input id="rv-name" placeholder="Your name" style="width:100%; margin-bottom:6px;" />
//       <input id="rv-rating" type="number" min="1" max="5" placeholder="Rating" style="width:100%; margin-bottom:6px;" />
//       <textarea id="rv-text" placeholder="Write your review" style="width:100%; height:60px; margin-bottom:6px;"></textarea>
//       <input id="rv-photos" type="file" multiple style="margin-bottom:6px;" />
//       <button id="rv-submit" style="width:100%;">Submit</button>
//       <div id="rv-msg" style="margin-top:6px; font-size:12px;"></div>
//     </div>
//   `;

//   const reviewsList = document.getElementById("reviews-list");
//   const modal = document.getElementById("review-modal");
//   const btnOpen = document.getElementById("open-review-btn");
//   const btnClose = document.getElementById("close-review-btn");

//   // open/close modal
//   btnOpen.addEventListener("click", () => modal.style.display = "block");
//   btnClose.addEventListener("click", () => modal.style.display = "none");

//   // load reviews
//   async function loadReviews() {
//     reviewsList.innerHTML = "Loading reviews...";
//     try {
//       const res = await fetch(`${BASE}/api/reviews/${productId}`);
//       const json = await res.json();
//       if (!json.success || !json.reviews || json.reviews.length === 0) {
//         reviewsList.innerHTML = "No reviews yet.";
//         return;
//       }
//       reviewsList.innerHTML = json.reviews.map(r => `
//         <div style="border:1px solid #ddd; margin-bottom:6px; padding:4px; border-radius:4px;">
//           <b>${r.customer_name || "Customer"}</b> ⭐ ${r.rating}<br/>
//           ${r.review_text || ""}
//         </div>
//       `).join("");
//     } catch(e) {
//       reviewsList.innerHTML = "Error loading reviews.";
//       console.error(e);
//     }
//   }

//   // submit review
//   document.getElementById("rv-submit").addEventListener("click", async () => {
//     const name = document.getElementById("rv-name").value.trim();
//     const rating = document.getElementById("rv-rating").value;
//     const text = document.getElementById("rv-text").value.trim();
//     const photos = document.getElementById("rv-photos").files;

//     if (!rating || rating < 1 || rating > 5) {
//       document.getElementById("rv-msg").innerText = "Enter rating 1-5";
//       return;
//     }

//     const fd = new FormData();
//     fd.append("product_id", productId);
//     fd.append("customer_name", name || "Customer");
//     fd.append("rating", rating);
//     fd.append("review_text", text || "");
//     for (let i=0;i<photos.length;i++) fd.append("images", photos[i]);

//     document.getElementById("rv-msg").innerText = "Submitting...";
//     try {
//       const resp = await fetch(`${BASE}/api/reviews/review`, { method:"POST", body: fd });
//       const j = await resp.json();
//       if (resp.ok && j.success) {
//         document.getElementById("rv-msg").innerText = "Submitted!";
//         modal.style.display = "none";
//         setTimeout(loadReviews, 500);
//       } else {
//         document.getElementById("rv-msg").innerText = j.error || j.message || "Failed";
//       }
//     } catch(err) {
//       document.getElementById("rv-msg").innerText = "Network error";
//       console.error(err);
//     }
//   });

//   // initial load
//   loadReviews();
// })();


(async function () {
  const BASE = "https://shopify-backend-pqh8.onrender.com";

  // get container
  const container = document.getElementById("loox-reviews");
  if (!container) return;

  // get product ID
  let productId = window.__LOOX_PRODUCT_ID || "";
  if (typeof productId === "string" && productId.includes("gid://")) {
    productId = productId.replace("gid://shopify/Product/", "");
  }
  productId = String(productId).trim();
  if (!productId) {
    container.innerHTML = "Product ID missing";
    return;
  }

  // avoid duplicates
  if (document.getElementById("loox-reviews-container")) return;

  // find the actual Buy it now button
  const buyNowBtn = Array.from(document.querySelectorAll("button")).find(
    (b) => b.innerText.trim().toLowerCase() === "buy it now"
  );
  if (!buyNowBtn) {
    console.log("Buy it now button not found");
    return;
  }

  // create wrapper
  const wrap = document.createElement("div");
  wrap.id = "loox-reviews-container";
  wrap.style.marginTop = "20px";

  // create button
  const btn = document.createElement("button");
  btn.innerText = "Write a Review";
  btn.style.padding = "10px 16px";
  btn.style.background = "#000";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.marginBottom = "20px";

  wrap.appendChild(btn);
  container.appendChild(wrap);

  // insert below Buy it now
  buyNowBtn.parentNode.insertBefore(wrap, buyNowBtn.nextSibling);

  // create modal
  const modal = document.createElement("div");
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.6)";
  modal.style.zIndex = "999999";
  modal.style.paddingTop = "80px";

  modal.innerHTML = `
    <div style="background:#fff; width:420px; margin:auto; padding:20px; border-radius:10px; position:relative;">
      <h3 style="margin-top:0;">Write a Review</h3>
      <label>Name</label>
      <input id="rv_name" style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ccc; border-radius:6px;" />

      <label>Rating (1–5)</label>
      <input id="rv_rate" type="number" min="1" max="5" style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ccc; border-radius:6px;" />

      <label>Review</label>
      <textarea id="rv_text" style="width:100%; margin-bottom:10px; padding:8px; border:1px solid #ccc; border-radius:6px;"></textarea>

      <label>Photos</label>
      <input id="rv_photos" type="file" multiple style="margin-bottom:10px;" />

      <button id="rv_submit" style="padding:10px 16px; background:#000; color:#fff; border:0; border-radius:6px; cursor:pointer;">Submit</button>

      <button id="rv_close" style="position:absolute; top:10px; right:10px; background:red; color:#fff; border:none; padding:5px 10px; border-radius:50%; cursor:pointer;">X</button>
    </div>
  `;

  document.body.appendChild(modal);

  // open + close
  btn.onclick = () => (modal.style.display = "block");
  modal.querySelector("#rv_close").onclick = () => (modal.style.display = "none");

  // reviews list
  const listBox = document.createElement("div");
  wrap.appendChild(listBox);

  async function loadReviews() {
    try {
      const res = await fetch(`${BASE}/api/reviews/${productId}`);
      const json = await res.json();

      listBox.innerHTML =
        json.reviews
          .map(
            (r) => `
        <div style="padding:10px; margin-bottom:10px; background:#fafafa; border-radius:6px;">
          <b>${r.customer_name}</b> — ${"⭐".repeat(r.rating)}<br>
          ${r.review_text}
        </div>
      `
          )
          .join("") || "<p>No reviews yet.</p>";
    } catch (err) {
      listBox.innerHTML = "Failed to load reviews.";
    }
  }

  loadReviews();

  // submit review
  document.getElementById("rv_submit").onclick = async () => {
    const fd = new FormData();
    fd.append("product_id", productId);
    fd.append("customer_name", document.getElementById("rv_name").value);
    fd.append("rating", document.getElementById("rv_rate").value);
    fd.append("review_text", document.getElementById("rv_text").value);

    const photos = document.getElementById("rv_photos").files;
    for (let i = 0; i < photos.length; i++) fd.append("images", photos[i]);

    try {
      await fetch(`${BASE}/api/reviews/review`, {
        method: "POST",
        body: fd,
      });

      modal.style.display = "none";
      loadReviews();
    } catch (err) {
      alert("Failed to submit review");
    }
  };
})();
