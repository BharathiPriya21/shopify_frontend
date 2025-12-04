import React, { useEffect, useState } from 'react';


 //const API = 'http://localhost:4000'; // change if needed
const API='https://shopify-backend-pqh8.onrender.com'

export default function App() {
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(false);


async function fetchReviews() {
setLoading(true);
const res = await fetch(`${API}/api/reviews/admin/list`);
const json = await res.json();
setReviews(json.reviews || []);
setLoading(false);
}


async function del(id) {
if (!confirm('Delete review?')) return;
await fetch(`${API}/api/reviews/admin/${id}`, { method: 'DELETE' });
fetchReviews();
}


useEffect(() => { fetchReviews(); }, []);


return (
<div className="container">
<h1>Loox Admin</h1>
{loading ? <div>Loading...</div> : (
<div className="list">
{reviews.map(r => (
<div key={r.id} className="card">
<div className="row">
<b>{r.customer_name || 'Customer'}</b>
<span>Rating: {r.rating}</span>
<button onClick={() => del(r.id)}>Delete</button>
</div>
<div>{r.review}</div>
<div className="imgs">
{(r.images || []).map((u,i) => <img key={i} src={u} alt="rev" />)}
</div>
<div className="meta">{new Date(r.created_at).toLocaleString()}</div>
</div>
))}
</div>
)}
</div>
);
}