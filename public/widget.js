
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
  const container = document.getElementById("loox-reviews");
  if (!container) return;

  const BASE_URL = "https://shopify-backend-pqh8.onrender.com";
  const PRODUCT_ID = String(window.__LOOX_PRODUCT_ID);

  if (!PRODUCT_ID) {
    container.innerHTML = "<p>Invalid Product ID</p>";
    return;
  }

  // Render only once (fix duplicate forms)
  if (window.__REVIEW_WIDGET_RENDERED__) return;
  window.__REVIEW_WIDGET_RENDERED__ = true;

  // UI HTML ------------------------------------------------------
  container.innerHTML = `
    <div>
      <button id="openReviewBtn">Write a Review</button>

      <div id="reviewModal" style="display:none; padding:20px; border:1px solid #ccc; background:#fff; width:400px;">
        <h3>Write a Review</h3>

        <input type="text" id="reviewName" placeholder="Your Name" /><br/><br/>
        <input type="number" id="reviewRating" min="1" max="5" placeholder="Rating (1-5)" /><br/><br/>
        <textarea id="reviewMessage" placeholder="Your Review"></textarea><br/><br/>
        <input type="file" id="reviewFile" /><br/><br/>

        <button id="submitReview">Submit Review</button>
        <button id="closeReview">Close</button>
      </div>

      <h3>Reviews</h3>
      <div id="reviewList"></div>
    </div>
  `;

  // ELEMENTS
  const openBtn = document.getElementById("openReviewBtn");
  const modal = document.getElementById("reviewModal");
  const closeBtn = document.getElementById("closeReview");
  const submitBtn = document.getElementById("submitReview");
  const listDiv = document.getElementById("reviewList");

  // OPEN/CLOSE
  openBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";

  // LOAD REVIEWS -------------------------------------------------
  async function loadReviews() {
    const res = await fetch(`${BASE_URL}/api/reviews/${PRODUCT_ID}`);
    const data = await res.json();

    listDiv.innerHTML = "";

    if (!data?.reviews?.length) {
      listDiv.innerHTML = "<p>No reviews yet.</p>";
      return;
    }

    data.reviews.forEach(r => {
      listDiv.innerHTML += `
        <div style="margin-bottom:15px; border:1px solid #ddd; padding:10px;">
          <b>${r.name}</b> <br/>
          ⭐ Rating: ${r.rating} <br/>
          <p>${r.review}</p>
          ${r.image_url ? `<img src="${r.image_url}" width="100" />` : ""}
          <br/><small>${r.created_at}</small>
        </div>
      `;
    });
  }

  loadReviews();

  // SUBMIT REVIEW ------------------------------------------------
  submitBtn.onclick = async () => {
    const name = document.getElementById("reviewName").value.trim();
    const rating = document.getElementById("reviewRating").value.trim();
    const message = document.getElementById("reviewMessage").value.trim();
    const fileInput = document.getElementById("reviewFile");
    const file = fileInput.files[0];

    // Clean validation
    if (!name || !rating || !message) {
      alert("All fields are required!");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("rating", rating);
    form.append("review", message);
    form.append("product_id", PRODUCT_ID);
    if (file) form.append("image", file);

    const res = await fetch(`${BASE_URL}/api/reviews/add`, {
      method: "POST",
      body: form
    });

    const out = await res.json();

    if (!out.status) {
      alert(out.message || "Error submitting review");
      return;
    }

    alert("Review submitted successfully!");

    // Clean form
    modal.style.display = "none";
    document.getElementById("reviewName").value = "";
    document.getElementById("reviewRating").value = "";
    document.getElementById("reviewMessage").value = "";
    document.getElementById("reviewFile").value = "";

    // Reload reviews
    loadReviews();
  };
})();
