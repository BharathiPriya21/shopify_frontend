
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



 (function () {
  console.log("⭐ Review Widget Loaded");

  const container = document.getElementById("loox-reviews");
  if (!container) return;

  let productId = window.__LOOX_PRODUCT_ID;
  const BASE = "https://shopify-backend-pqh8.onrender.com";

  if (String(productId).includes("gid://")) {
    productId = productId.replace("gid://shopify/Product/", "");
  }

  // -----------------------
  // MAIN WRAPPER
  // -----------------------
  const wrapper = document.createElement("div");
  wrapper.id = "reviews-wrapper";
  container.appendChild(wrapper);

  // -----------------------
  // WRITE REVIEW BUTTON
  // -----------------------
  const writeBtn = document.createElement("button");
  writeBtn.type = "button";
  writeBtn.innerText = "Write a Review";
  writeBtn.style.cssText = `
    padding: 10px 16px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 20px;
    display: block;
  `;
  wrapper.appendChild(writeBtn);

  // -----------------------
  // MODAL
  // -----------------------
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.5);
    display:none; justify-content:center; align-items:center;
    z-index: 99999;
  `;

  modal.innerHTML = `
    <div style="background:#fff; padding:20px; width:350px; border-radius:10px;">
      <h3>Write a Review</h3>
      <input id="rv_name" placeholder="Your Name" style="width:100%; padding:8px; margin-bottom:10px;">
      <input id="rv_rating" type="number" min="1" max="5" placeholder="Rating 1-5"
        style="width:100%; padding:8px; margin-bottom:10px;">
      <textarea id="rv_text" placeholder="Your Review"
        style="width:100%; padding:8px; margin-bottom:10px;"></textarea>
      <input id="rv_img" type="file" accept="image/*" style="margin-bottom:10px;" />
      <br><br>
      <button id="rv_submit" style="padding:10px 16px; background:green; color:white; border:none; border-radius:6px;">
        Submit Review
      </button>
      <button id="rv_close" style="padding:10px 16px; background:red; color:white; border:none; border-radius:6px; margin-left:10px;">
        Close
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  writeBtn.onclick = () => (modal.style.display = "flex");
  modal.querySelector("#rv_close").onclick = () => (modal.style.display = "none");

  // -----------------------
  // SUBMIT REVIEW
  // -----------------------
  modal.querySelector("#rv_submit").onclick = async () => {
    const name = document.getElementById("rv_name").value;
    const rating = document.getElementById("rv_rating").value;
    const text = document.getElementById("rv_text").value;
    const img = document.getElementById("rv_img").files[0];

    if (!name || !rating || !text) return alert("All fields required!");

    const fd = new FormData();
    fd.append("customer_name", name);
    fd.append("rating", rating);
    fd.append("review_text", text);
    fd.append("product_id", productId);
    if (img) fd.append("image", img);

    try {
      const res = await fetch(`${BASE}/api/reviews/create`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json();

      if (json.success) {
        alert("Review Submitted!");
        modal.style.display = "none";
        loadReviews(); // reload reviews
      } else {
        alert("Error submitting review!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  // -----------------------
  // LOAD REVIEWS
  // -----------------------
  async function loadReviews() {
    // CLEAR only reviews, not button
    const existingList = document.getElementById("reviews-list");
    if (existingList) existingList.remove();

    const list = document.createElement("div");
    list.id = "reviews-list";
    wrapper.appendChild(list);

    try {
      const res = await fetch(`${BASE}/api/reviews/${productId}`);
      const json = await res.json();

      if (!json.success || json.reviews.length === 0) {
        list.innerHTML = "<p>No Reviews Yet</p>";
        return;
      }

      list.innerHTML = json.reviews
        .map(
          (r) => `
        <div style="padding:12px; border:1px solid #ddd; border-radius:6px; margin:10px 0;">
          <b>${r.customer_name}</b><br/>
          ⭐ Rating: ${r.rating}<br/><br/>
          ${r.review_text}<br/><br/>
          ${
            r.image_url
              ? `<img src="${BASE + r.image_url}" style="width:90px; border-radius:6px;">`
              : ""
          }
          <br/><small>${new Date(r.created_at).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
    } catch (err) {
      console.error(err);
      list.innerHTML = "Error loading reviews.";
    }
  }

  // initial load
  loadReviews();
})();
