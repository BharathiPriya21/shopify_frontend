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

  // ⭐ Fix for Shopify GID → Number
  if (productId.includes("gid://")) {
    productId = productId.replace("gid://shopify/Product/", "");
  }

  try {
    const res = await fetch(`${BASE}/api/reviews/${productId}`);
    const json = await res.json();

    if (!json.success || json.reviews.length === 0) {
      container.innerHTML = "No reviews yet.";
      return;
    }

    const html = json.reviews
      .map(
        (r) => `
      <div style="padding:10px; border:1px solid #ddd; margin-bottom:10px; border-radius:6px;">
        <b>${r.customer_name || "Customer"}</b><br/>
        Rating: ${r.rating}<br/>
        <small>${new Date(r.created_at).toLocaleString()}</small>
      </div>
    `
      )
      .join("");

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = "Error loading reviews.";
    console.error(err);
  }
})();
