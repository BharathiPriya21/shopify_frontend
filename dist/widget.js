
// widget.js - use with your current backend route: router.post('/review', upload.array('images'), ctrl.addReview);
// (async function () {
//   try {
//     const container = document.getElementById("loox-reviews");
//     if (!container) return;

//     const BASE_URL = "https://shopify-backend-pqh8.onrender.com";
//     let productId = window.__LOOX_PRODUCT_ID || "";
//     if (String(productId).includes("gid://")) {
//       productId = productId.replace("gid://shopify/Product/", "");
//     }
//     productId = String(productId).trim();
//     if (!productId) {
//       container.innerHTML = "<p>Product ID missing</p>";
//       return;
//     }

//     // avoid rendering twice
//     if (window.__REVIEW_WIDGET_RENDERED__) return;
//     window.__REVIEW_WIDGET_RENDERED__ = true;

//     // build UI
//     container.innerHTML = `
//       <div id="loox-widget-wrap" style="font-family: Arial, sans-serif;">
//         <div id="loox-controls" style="margin-bottom:12px;">
//           <button id="loox-open" style="padding:8px 12px;background:#000;color:#fff;border-radius:6px;border:0;cursor:pointer;">Write a Review</button>
//         </div>

//         <div id="loox-list"></div>
//       </div>

//       <div id="loox-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:99999;align-items:center;justify-content:center;">
//         <div style="background:#fff;padding:18px;border-radius:8px;width:380px;max-width:95%;box-shadow:0 6px 24px rgba(0,0,0,0.2);">
//           <h3 style="margin:0 0 10px 0;">Write a Review</h3>
//           <input id="loox-name" placeholder="Your name" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />
//           <input id="loox-rating" type="number" min="1" max="5" placeholder="Rating (1-5)" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />
//           <textarea id="loox-text" placeholder="Your review" rows="4" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;"></textarea>
//           <input id="loox-files" type="file" multiple accept="image/*" style="margin-bottom:8px;" />
//           <div style="display:flex;gap:8px;">
//             <button id="loox-submit" style="flex:1;padding:10px;background:green;color:#fff;border:0;border-radius:6px;cursor:pointer;">Submit Review</button>
//             <button id="loox-close" style="padding:10px;background:#c00;color:#fff;border:0;border-radius:6px;cursor:pointer;">Close</button>
//           </div>
//           <div id="loox-msg" style="margin-top:8px;color:#c00;font-size:13px;"></div>
//         </div>
//       </div>
//     `;

//     const openBtn = document.getElementById("loox-open");
//     const modal = document.getElementById("loox-modal");
//     const closeBtn = document.getElementById("loox-close");
//     const submitBtn = document.getElementById("loox-submit");
//     const listDiv = document.getElementById("loox-list");
//     const msgDiv = document.getElementById("loox-msg");

//     openBtn.addEventListener("click", () => {
//       msgDiv.innerText = "";
//       modal.style.display = "flex";
//     });
//     closeBtn.addEventListener("click", () => modal.style.display = "none");

//     // load reviews
//     async function loadReviews() {
//       listDiv.innerHTML = "Loading reviews...";
//       try {
//         const resp = await fetch(`${BASE_URL}/api/reviews/${productId}`);
//         if (!resp.ok) {
//           listDiv.innerHTML = "<p>Failed to load reviews</p>";
//           return;
//         }
//         const data = await resp.json();
//         const reviews = data.reviews || [];
//         if (!reviews.length) {
//           listDiv.innerHTML = "<p>No reviews yet.</p>";
//           return;
//         }
//         listDiv.innerHTML = reviews.map(r => {
//           const imgHTML = r.photos && r.photos.length ? (r.photos.map(p => `<img src="${p}" style="max-width:80px;margin-top:8px;display:block;" />`).join("")) : "";
//           const created = r.created_at ? new Date(r.created_at).toLocaleString() : "";
//           // backend field names: customer_name / rating / review_text
//           const name = r.customer_name || r.name || "Customer";
//           const text = r.review_text || r.review || "";
//           const rating = r.rating || "";
//           return `
//             <div style="border:1px solid #e6e6e6;padding:10px;border-radius:8px;margin-bottom:10px;background:#fff;">
//               <strong>${name}</strong><br/>
//               <span>⭐ ${rating}</span>
//               <p style="margin:8px 0 0 0;">${text}</p>
//               ${imgHTML}
//               <small style="color:#666">${created}</small>
//             </div>
//           `;
//         }).join("");
//       } catch (err) {
//         console.error(err);
//         listDiv.innerHTML = "<p>Error loading reviews.</p>";
//       }
//     }

//     await loadReviews();

//     // submit handler: send fields expected by your backend
//     submitBtn.addEventListener("click", async () => {
//       msgDiv.innerText = "";

//       const name = document.getElementById("loox-name").value.trim();
//       const rating = document.getElementById("loox-rating").value.trim();
//       const review_text = document.getElementById("loox-text").value.trim();
//       const files = document.getElementById("loox-files").files;

//       if (!name || !rating || !review_text) {
//         msgDiv.innerText = "All fields are required.";
//         return;
//       }

//       const form = new FormData();
//       form.append("product_id", productId);
//       form.append("rating", rating);
//       form.append("review_text", review_text);
//       form.append("customer_name", name);

//       // backend uses upload.array('images'), so append with name 'images'
//       for (let i = 0; i < files.length; i++) {
//         form.append("images", files[i]);
//       }

//       try {
//         const resp = await fetch(`${BASE_URL}/api/reviews/review`, {
//           method: "POST",
//           body: form
//         });

//         const body = await resp.json();
//         if (!resp.ok) {
//           msgDiv.innerText = body.error || body.message || "Server error";
//           console.error("POST error:", body);
//           return;
//         }

//         // success
//         modal.style.display = "none";
//         // clear inputs
//         document.getElementById("loox-name").value = "";
//         document.getElementById("loox-rating").value = "";
//         document.getElementById("loox-text").value = "";
//         document.getElementById("loox-files").value = "";

//         // reload reviews
//         await loadReviews();
//       } catch (err) {
//         console.error(err);
//         msgDiv.innerText = "Network error";
//       }
//     });

//   } catch (err) {
//     console.error("Widget init error", err);
//   }
// })();


// (async function () {
//   try {
//     const container = document.getElementById("loox-reviews");
//     if (!container) return;

//     const BASE_URL = "https://shopify-backend-pqh8.onrender.com";

//     // Convert Shopify GID → product id number
//     let productId = window.__LOOX_PRODUCT_ID || "";
//     if (String(productId).includes("gid://")) {
//       productId = productId.replace("gid://shopify/Product/", "");
//     }
//     productId = String(productId).trim();

//     if (!productId) {
//       container.innerHTML = "<p>Product ID missing</p>";
//       return;
//     }

//     // Avoid double render
//     if (window.__REVIEW_WIDGET_RENDERED__) return;
//     window.__REVIEW_WIDGET_RENDERED__ = true;

//     // ---- UI BUILD ----
//     container.innerHTML = `
//       <div id="loox-widget-wrap" style="font-family: Arial, sans-serif;">
        
//         <div style="margin-bottom:12px;">
//           <button id="loox-open" 
//             style="padding:8px 12px;background:#000;color:#fff;border-radius:6px;border:0;cursor:pointer;">
//             Write a Review
//           </button>
//         </div>

//         <h3 style="margin-bottom:6px;">Reviews</h3>
//         <div id="loox-list"></div>
//       </div>

//       <div id="loox-modal" 
//         style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);
//         z-index:99999;align-items:center;justify-content:center;">
        
//         <div style="background:#fff;padding:18px;border-radius:8px;width:380px;max-width:95%;
//         box-shadow:0 6px 24px rgba(0,0,0,0.2);">

//           <h3 style="margin:0 0 10px 0;">Write a Review</h3>

//           <input id="loox-name" placeholder="Your name"
//             style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />

//           <input id="loox-rating" type="number" min="1" max="5" placeholder="Rating (1-5)"
//             style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />

//           <textarea id="loox-text" placeholder="Your review" rows="4"
//             style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;"></textarea>

//           <input id="loox-files" type="file" multiple accept="image/*" style="margin-bottom:8px;" />

//           <div style="display:flex;gap:8px;">
//             <button id="loox-submit" 
//               style="flex:1;padding:10px;background:green;color:#fff;border:0;border-radius:6px;cursor:pointer;">
//               Submit Review
//             </button>
//             <button id="loox-close" 
//               style="padding:10px;background:#c00;color:#fff;border:0;border-radius:6px;cursor:pointer;">
//               Close
//             </button>
//           </div>

//           <div id="loox-msg" style="margin-top:8px;color:#c00;font-size:13px;"></div>
//         </div>
//       </div>
//     `;

//     // ELEMENTS
//     const openBtn = document.getElementById("loox-open");
//     const closeBtn = document.getElementById("loox-close");
//     const submitBtn = document.getElementById("loox-submit");
//     const modal = document.getElementById("loox-modal");
//     const listDiv = document.getElementById("loox-list");
//     const msgDiv = document.getElementById("loox-msg");

//     // Open/Close modal
//     openBtn.addEventListener("click", () => { msgDiv.innerText = ""; modal.style.display = "flex"; });
//     closeBtn.addEventListener("click", () => { modal.style.display = "none"; });

//     // ---- LOAD REVIEWS ----
//     async function loadReviews() {
//       listDiv.innerHTML = "Loading reviews...";
//       try {
//         const resp = await fetch(`${BASE_URL}/api/reviews/${productId}`);
//         const data = await resp.json();

//         const reviews = data.reviews || [];
//         if (!reviews.length) {
//           listDiv.innerHTML = "<p>No reviews yet.</p>";
//           return;
//         }

//         listDiv.innerHTML = reviews.map(r => {
//           const name = r.customer_name || "Customer";
//           const text = r.review_text || "";
//           const rating = Number(r.rating) || 0;
//           const stars = "⭐ ".repeat(rating).trim();

//           const created = r.created_at ? new Date(r.created_at).toLocaleString() : "";

//           const imgs = r.photos?.length
//             ? r.photos.map(p => `<img src="${p}" style="max-width:80px;margin-top:8px;" />`).join("")
//             : "";

//           return `
//             <div style="border:1px solid #e6e6e6;padding:10px;border-radius:8px;margin-bottom:10px;background:#fff;">
//               <strong>${name}</strong><br/>
//               <span>${stars}</span>
//               <p style="margin:8px 0 0 0;">${text}</p>
//               ${imgs}
//               <small style="color:#666;display:block;margin-top:6px;">${created}</small>
//             </div>
//           `;
//         }).join("");

//       } catch (err) {
//         console.error(err);
//         listDiv.innerHTML = "<p>Error loading reviews.</p>";
//       }
//     }

//     await loadReviews();

//     // ---- SUBMIT REVIEW ----
//     submitBtn.addEventListener("click", async () => {
//       msgDiv.innerText = "";
//       const name = document.getElementById("loox-name").value.trim();
//       const rating = document.getElementById("loox-rating").value.trim();
//       const review_text = document.getElementById("loox-text").value.trim();
//       const files = document.getElementById("loox-files").files;

//       if (!name || !rating || !review_text) {
//         msgDiv.innerText = "All fields are required.";
//         return;
//       }

//       const form = new FormData();
//       form.append("product_id", productId);
//       form.append("rating", rating);
//       form.append("review_text", review_text);
//       form.append("customer_name", name);

//       for (let i = 0; i < files.length; i++) {
//         form.append("images", files[i]); // backend expects array name 'images'
//       }

//       try {
//         const resp = await fetch(`${BASE_URL}/api/reviews/review`, {
//           method: "POST",
//           body: form
//         });
//         const body = await resp.json();

//         if (!resp.ok) {
//           msgDiv.innerText = body.error || body.message || "Error submitting review";
//           return;
//         }

//         // Success
//         modal.style.display = "none";
//         document.getElementById("loox-name").value = "";
//         document.getElementById("loox-rating").value = "";
//         document.getElementById("loox-text").value = "";
//         document.getElementById("loox-files").value = "";

//         await loadReviews();

//       } catch (err) {
//         console.error(err);
//         msgDiv.innerText = "Network error. Try again.";
//       }
//     });

//   } catch (err) {
//     console.error("Widget init error", err);
//   }
// })();

(async function () {
  try {
    const container = document.getElementById("loox-reviews");
    if (!container) return;

    const BASE_URL = "https://shopify-backend-pqh8.onrender.com";

    // Convert Shopify GID → product id number
    let productId = window.__LOOX_PRODUCT_ID || "";
    if (String(productId).includes("gid://")) {
      productId = productId.replace("gid://shopify/Product/", "");
    }
    productId = String(productId).trim();

    if (!productId) {
      container.innerHTML = "<p>Product ID missing</p>";
      return;
    }

    // Avoid double render
    if (window.__REVIEW_WIDGET_RENDERED__) return;
    window.__REVIEW_WIDGET_RENDERED__ = true;

    // ---- UI BUILD ----
    container.innerHTML = `
      <div id="loox-widget-wrap" style="font-family: Arial, sans-serif;">
        
        <div style="margin-bottom:12px;">
          <button id="loox-open" 
            style="padding:8px 12px;background:#000;color:#fff;border-radius:6px;border:0;cursor:pointer;">
            Write a Review
          </button>
        </div>

        <h3 style="margin-bottom:6px;">Reviews</h3>
        <div id="loox-list"></div>
      </div>

      <div id="loox-modal" 
        style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);
        z-index:99999;align-items:center;justify-content:center;">
        
        <div style="background:#fff;padding:18px;border-radius:8px;width:380px;max-width:95%;
        box-shadow:0 6px 24px rgba(0,0,0,0.2);">

          <h3 style="margin:0 0 10px 0;">Write a Review</h3>

          <input id="loox-name" placeholder="Your name"
            style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />

          <input id="loox-rating" type="number" min="1" max="5" placeholder="Rating (1-5)"
            style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;" />

          <textarea id="loox-text" placeholder="Your review" rows="4"
            style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;"></textarea>

          <input id="loox-files" type="file" multiple accept="image/*" style="margin-bottom:8px;" />

          <div style="display:flex;gap:8px;">
            <button id="loox-submit" 
              style="flex:1;padding:10px;background:green;color:#fff;border:0;border-radius:6px;cursor:pointer;">
              Submit Review
            </button>
            <button id="loox-close" 
              style="padding:10px;background:#c00;color:#fff;border:0;border-radius:6px;cursor:pointer;">
              Close
            </button>
          </div>

          <div id="loox-msg" style="margin-top:8px;color:#c00;font-size:13px;"></div>
        </div>
      </div>
    `;

    // ELEMENTS
    const openBtn = document.getElementById("loox-open");
    const closeBtn = document.getElementById("loox-close");
    const submitBtn = document.getElementById("loox-submit");
    const modal = document.getElementById("loox-modal");
    const listDiv = document.getElementById("loox-list");
    const msgDiv = document.getElementById("loox-msg");

    // Open/Close modal
    openBtn.addEventListener("click", () => { msgDiv.innerText = ""; modal.style.display = "flex"; });
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });

    // ---- LOAD REVIEWS ----
    async function loadReviews() {
      listDiv.innerHTML = "Loading reviews...";
      try {
        const resp = await fetch(`${BASE_URL}/api/reviews/${productId}`);
        const data = await resp.json();

        const reviews = data.reviews || [];
        if (!reviews.length) {
          listDiv.innerHTML = "<p>No reviews yet.</p>";
          return;
        }

        listDiv.innerHTML = reviews.map(r => {
          const name = r.customer_name || "Customer";
          const text = r.review_text || "";
          const rating = Number(r.rating) || 0;
          const stars = "⭐ ".repeat(rating).trim();
          const created = r.created_at ? new Date(r.created_at).toLocaleString() : "";
          const imgs = r.photos?.length
            ? r.photos.map(p => `<img src="${p}" style="max-width:80px;margin-top:8px;" />`).join("")
            : "";

          return `
            <div class="review-box" 
              style="border:1px solid #e6e6e6;padding:10px;border-radius:8px;margin-bottom:10px;background:#fff;">
              
              <strong>${name}</strong><br/>
              <span>${stars}</span>
              <p style="margin:8px 0 0 0;">${text}</p>
              ${imgs}
              <small style="color:#666;display:block;margin-top:6px;">${created}</small>

              <button class="delete-btn" data-id="${r.id}"
                style="margin-top:8px;padding:6px 10px;background:#c00;color:#fff;border:0;border-radius:4px;cursor:pointer;">
                Delete
              </button>
            </div>
          `;
        }).join("");

        // ---- DELETE HANDLER ----
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (!confirm("Delete this review?")) return;

            try {
              const del = await fetch(`${BASE_URL}/api/reviews/admin/${id}`, {
                method: "DELETE"
              });

              const res = await del.json();

              if (res.success) {
                btn.closest(".review-box").remove(); // Remove from UI
              } else {
                alert("Failed to delete review");
              }
            } catch (err) {
              console.error(err);
              alert("Network error while deleting");
            }
          });
        });

      } catch (err) {
        console.error(err);
        listDiv.innerHTML = "<p>Error loading reviews.</p>";
      }
    }

    await loadReviews();

    // ---- SUBMIT REVIEW ----
    submitBtn.addEventListener("click", async () => {
      msgDiv.innerText = "";
      const name = document.getElementById("loox-name").value.trim();
      const rating = document.getElementById("loox-rating").value.trim();
      const review_text = document.getElementById("loox-text").value.trim();
      const files = document.getElementById("loox-files").files;

      if (!name || !rating || !review_text) {
        msgDiv.innerText = "All fields are required.";
        return;
      }

      const form = new FormData();
      form.append("product_id", productId);
      form.append("rating", rating);
      form.append("review_text", review_text);
      form.append("customer_name", name);

      for (let i = 0; i < files.length; i++) {
        form.append("images", files[i]);
      }

      try {
        const resp = await fetch(`${BASE_URL}/api/reviews/review`, {
          method: "POST",
          body: form
        });
        const body = await resp.json();

        if (!resp.ok) {
          msgDiv.innerText = body.error || body.message || "Error submitting review";
          return;
        }

        modal.style.display = "none";
        document.getElementById("loox-name").value = "";
        document.getElementById("loox-rating").value = "";
        document.getElementById("loox-text").value = "";
        document.getElementById("loox-files").value = "";

        await loadReviews();

      } catch (err) {
        console.error(err);
        msgDiv.innerText = "Network error. Try again.";
      }
    });

  } catch (err) {
    console.error("Widget init error", err);
  }
})();
