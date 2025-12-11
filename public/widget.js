
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
  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', async () => {

    const BASE = "https://shopify-backend-pqh8.onrender.com";
    let productId = window.__LOOX_PRODUCT_ID;

    if (!productId) return;

    // GID → number
    if (typeof productId === "string" && productId.includes("gid://")) {
      productId = productId.replace("gid://shopify/Product/", "");
    }

    // Insert review container below Buy It Now button
    const buyNowBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.innerText.trim().toLowerCase() === 'buy it now'
    );
    if (!buyNowBtn) return;

    const reviewWrapper = document.createElement('div');
    reviewWrapper.id = "loox-reviews-container";
    reviewWrapper.style.marginTop = "20px";
    buyNowBtn.parentNode.insertBefore(reviewWrapper, buyNowBtn.nextSibling);

    reviewWrapper.innerHTML = `
      <div id="loox-reviews" style="max-width:400px;">
        <div id="reviews-list">Loading reviews...</div>
        <button id="open-review-btn" 
          style="
            margin-top: 10px; 
            padding: 6px 12px; 
            background-color: #007bff; 
            color: #fff; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
          "
        >Write a Review</button>
        <div id="review-modal" 
          style="
            display:none; 
            position: fixed; 
            right: 20px; 
            top: 80px; 
            width: 300px; 
            z-index: 9999; 
            background: #fff; 
            border: 1px solid #ddd; 
            padding: 10px; 
            border-radius: 6px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          "
        >
          <button id="close-review-btn" style="float:right; background:none; border:none; cursor:pointer;">✕</button>
          <h4 style="margin-top:0;">Write a Review</h4>
          <input id="rv-name" placeholder="Your name" style="width:100%; margin-bottom:6px; padding:4px;" />
          <input id="rv-rating" type="number" min="1" max="5" placeholder="Rating" style="width:100%; margin-bottom:6px; padding:4px;" />
          <textarea id="rv-text" placeholder="Write your review" style="width:100%; margin-bottom:6px; padding:4px;"></textarea>
          <input id="rv-photos" type="file" multiple style="width:100%; margin-bottom:6px; padding:4px;" />
          <button id="rv-submit" 
            style="
              padding: 6px 12px; 
              background-color: #28a745; 
              color: #fff; 
              border: none; 
              border-radius: 4px; 
              cursor: pointer;
            "
          >Submit</button>
          <div id="rv-msg" style="margin-top:6px;"></div>
        </div>
      </div>
    `;

    const reviewsList = document.getElementById("reviews-list");
    const modal = document.getElementById("review-modal");
    const btnOpen = document.getElementById("open-review-btn");
    const btnClose = document.getElementById("close-review-btn");

    // Hover effect for open button
    btnOpen.addEventListener("mouseenter", () => btnOpen.style.backgroundColor = "#0056b3");
    btnOpen.addEventListener("mouseleave", () => btnOpen.style.backgroundColor = "#007bff");

    // Open/close modal
    btnOpen.addEventListener("click", () => modal.style.display = "block");
    btnClose.addEventListener("click", () => modal.style.display = "none");

    // Load reviews
    async function loadReviews() {
      reviewsList.innerHTML = "Loading reviews...";
      try {
        const res = await fetch(`${BASE}/api/reviews/${productId}`);
        const json = await res.json();
        if (!json.success || !json.reviews || json.reviews.length === 0) {
          reviewsList.innerHTML = "No reviews yet.";
          return;
        }
        reviewsList.innerHTML = json.reviews.map(r => {
          const stars = '⭐'.repeat(r.rating);
          return `
            <div class="loox-review" style="border:1px solid #ddd; padding:8px; border-radius:6px; margin-bottom:10px; background:#fafafa;">
              <b>${r.customer_name || "Customer"}</b> ${stars}<br/>
              ${r.review_text || ""}
            </div>
          `;
        }).join("");
      } catch(e) {
        reviewsList.innerHTML = "Error loading reviews.";
        console.error(e);
      }
    }

    // Submit review
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
      for (let i=0; i<photos.length; i++) fd.append("images", photos[i]);

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

    // Initial load
    loadReviews();
  });
})();
