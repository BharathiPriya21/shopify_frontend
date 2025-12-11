// (async function () {
//   const container = document.getElementById("loox-reviews");
//   if (!container) return;

//   container.innerHTML = "Loading reviews...";

//   const productId = window.__LOOX_PRODUCT_ID;
//   const BASE = window.__LOOX_BASE_URL;

//   try {
//     const res = await fetch(`${BASE}/api/reviews/${productId}`);
//     const json = await res.json();

//     if (!json.success || json.reviews.length === 0) {
//       container.innerHTML = "No reviews yet.";
//       return;
//     }

//     const html = json.reviews
//       .map(
//         (r) => `
//       <div style="padding:10px; border:1px solid #ddd; margin-bottom:10px; border-radius:6px;">
//         <b>${r.customer_name}</b><br/>
//         Rating: ${r.rating}<br/>
//         <small>${new Date(r.created_at).toLocaleString()}</small>
//       </div>
//     `
//       )
//       .join("");

//     container.innerHTML = html;
//   } catch (err) {
//     container.innerHTML = "Error loading reviews.";
//     console.error(err);
//   }
// })();
// (async function () {
//   const container = document.getElementById("loox-reviews");
//   if (!container) return;

//   container.innerHTML = "Loading reviews...";

//   let productId = window.__LOOX_PRODUCT_ID;
//   const BASE = window.__LOOX_BASE_URL;

//   // ⭐ Fix: ensure productId exists
//   if (!productId) {
//     container.innerHTML = "Product ID missing.";
//     return;
//   }

//   // ⭐ Fix for Shopify GID → Plain Number
//   if (typeof productId === "string" && productId.includes("gid://")) {
//     productId = productId.replace("gid://shopify/Product/", "");
//   }

//   console.log("➡️ Widget Loaded");
//   console.log("Product ID:", productId);
//   console.log("Backend API:", `${BASE}/api/reviews/${productId}`);

//   try {
//     const res = await fetch(`${BASE}/api/reviews/${productId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });

//     if (!res.ok) {
//       console.error("HTTP ERROR:", res.status, res.statusText);
//       container.innerHTML = "Error loading reviews.";
//       return;
//     }

//     const json = await res.json();

//     if (!json.success || !Array.isArray(json.reviews) || json.reviews.length === 0) {
//       container.innerHTML = "No reviews yet.";
//       return;
//     }

//     const html = json.reviews
//       .map(
//         (r) => `
//       <div style="padding:10px; border:1px solid #ddd; margin-bottom:10px; border-radius:6px;">
//         <b>${r.customer_name || "Customer"}</b><br/>
//         ⭐ Rating: ${r.rating}<br/>
//         <small>${new Date(r.created_at).toLocaleString()}</small>
//       </div>
//     `
//       )
//       .join("");

//     container.innerHTML = html;

//   } catch (err) {
//     container.innerHTML = "Error loading reviews.";
//     console.error(" Widget Error:", err);
//   }
// })();


(async function () {
  const container = document.getElementById("loox-reviews");
  if (!container) return;

  const BASE = window.__LOOX_BASE_URL;
  let productId = window.__LOOX_PRODUCT_ID;

  if (!productId) {
    container.innerHTML = "Product ID missing.";
    return;
  }

  // GID → number
  if (typeof productId === "string" && productId.includes("gid://")) {
    productId = productId.replace("gid://shopify/Product/", "");
  }

  // render reviews + button + modal
  container.innerHTML = `
    <div id="reviews-list">Loading reviews...</div>
    <button id="open-review-btn" style="margin-top:8px;padding:6px 12px;">Write a Review</button>

    <div id="review-modal" style="display:none; position:fixed; right:20px; top:80px; width:300px; z-index:9999; background:#fff; border:1px solid #ddd; padding:10px; border-radius:6px;">
      <button id="close-review-btn" style="float:right;">✕</button>
      <h4>Write a Review</h4>
      <input id="rv-name" placeholder="Your name" style="width:100%; margin-bottom:6px;" />
      <input id="rv-rating" type="number" min="1" max="5" placeholder="Rating" style="width:100%; margin-bottom:6px;" />
      <textarea id="rv-text" placeholder="Write your review" style="width:100%; height:60px; margin-bottom:6px;"></textarea>
      <input id="rv-photos" type="file" multiple style="margin-bottom:6px;" />
      <button id="rv-submit" style="width:100%;">Submit</button>
      <div id="rv-msg" style="margin-top:6px; font-size:12px;"></div>
    </div>
  `;

  const reviewsList = document.getElementById("reviews-list");
  const modal = document.getElementById("review-modal");
  const btnOpen = document.getElementById("open-review-btn");
  const btnClose = document.getElementById("close-review-btn");

  // open/close modal
  btnOpen.addEventListener("click", () => modal.style.display = "block");
  btnClose.addEventListener("click", () => modal.style.display = "none");

  // load reviews
  async function loadReviews() {
    reviewsList.innerHTML = "Loading reviews...";
    try {
      const res = await fetch(`${BASE}/api/reviews/${productId}`);
      const json = await res.json();
      if (!json.success || !json.reviews || json.reviews.length === 0) {
        reviewsList.innerHTML = "No reviews yet.";
        return;
      }
      reviewsList.innerHTML = json.reviews.map(r => `
        <div style="border:1px solid #ddd; margin-bottom:6px; padding:4px; border-radius:4px;">
          <b>${r.customer_name || "Customer"}</b> ⭐ ${r.rating}<br/>
          ${r.review_text || ""}
        </div>
      `).join("");
    } catch(e) {
      reviewsList.innerHTML = "Error loading reviews.";
      console.error(e);
    }
  }

  // submit review
  document.getElementById("rv-submit").addEventListener("click", async () => {
    const name = document.getElementById("rv-name").value.trim();
    const rating = document.getElementById("rv-rating").value;
    const text = document.getElementById("rv-text").value.trim();
    const photos = document.getElementById("rv-photos").files;

    if (!rating || rating < 1 || rating > 5) {
      document.getElementById("rv-msg").innerText = "Enter rating 1-5";
      return;
    }

    const fd = new FormData();
    fd.append("product_id", productId);
    fd.append("customer_name", name || "Customer");
    fd.append("rating", rating);
    fd.append("review_text", text || "");
    for (let i=0;i<photos.length;i++) fd.append("images", photos[i]);

    document.getElementById("rv-msg").innerText = "Submitting...";
    try {
      const resp = await fetch(`${BASE}/api/reviews/review`, { method:"POST", body: fd });
      const j = await resp.json();
      if (resp.ok && j.success) {
        document.getElementById("rv-msg").innerText = "Submitted!";
        modal.style.display = "none";
        setTimeout(loadReviews, 500);
      } else {
        document.getElementById("rv-msg").innerText = j.error || j.message || "Failed";
      }
    } catch(err) {
      document.getElementById("rv-msg").innerText = "Network error";
      console.error(err);
    }
  });

  // initial load
  loadReviews();
})();
