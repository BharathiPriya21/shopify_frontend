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
(async function () {
  const container = document.getElementById("loox-reviews");
  if (!container) return;

  container.innerHTML = "Loading reviews...";

  let productId = window.__LOOX_PRODUCT_ID;
  const BASE = window.__LOOX_BASE_URL;

  // ⭐ Fix: ensure productId exists
  if (!productId) {
    container.innerHTML = "Product ID missing.";
    return;
  }

  // ⭐ Fix for Shopify GID → Plain Number
  if (typeof productId === "string" && productId.includes("gid://")) {
    productId = productId.replace("gid://shopify/Product/", "");
  }

  console.log("➡️ Widget Loaded");
  console.log("Product ID:", productId);
  console.log("Backend API:", `${BASE}/api/reviews/${productId}`);

  try {
    const res = await fetch(`${BASE}/api/reviews/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      console.error("HTTP ERROR:", res.status, res.statusText);
      container.innerHTML = "Error loading reviews.";
      return;
    }

    const json = await res.json();

    if (!json.success || !Array.isArray(json.reviews) || json.reviews.length === 0) {
      container.innerHTML = "No reviews yet.";
      return;
    }

    const html = json.reviews
      .map(
        (r) => `
      <div style="padding:10px; border:1px solid #ddd; margin-bottom:10px; border-radius:6px;">
        <b>${r.customer_name || "Customer"}</b><br/>
        ⭐ Rating: ${r.rating}<br/>
        <small>${new Date(r.created_at).toLocaleString()}</small>
      </div>
    `
      )
      .join("");

    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = "Error loading reviews.";
    console.error(" Widget Error:", err);
  }
})();
