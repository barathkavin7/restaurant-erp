async function loadHome() {
  const [items, reviews] = await Promise.all([
    RestaurantAPI.get('/api/menu/items?availableOnly=true'),
    RestaurantAPI.get('/api/reviews/public')
  ]);

  const featured = items.slice(0, 8);
  document.getElementById('featuredDishes').innerHTML = featured.map((item) => `
    <article class="food-card">
      <img src="${item.image_url}" alt="${item.name}">
      <div class="food-card-body">
        <span class="tag">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price-line">
          <span>₹${Number(item.price).toFixed(2)}</span>
          <span>${item.is_veg ? 'Veg' : 'Non-Veg'}</span>
        </div>
      </div>
    </article>
  `).join('');

  document.getElementById('reviewList').innerHTML = reviews.slice(0, 6).map((review) => `
    <article class="review-card">
      <span class="tag">${review.food_rating}/5 food · ${review.service_rating}/5 service</span>
      <p>${review.comment}</p>
      <strong>${review.customer_name}</strong>
    </article>
  `).join('');
}

loadHome().catch(() => {
  document.getElementById('featuredDishes').innerHTML = '<p class="muted">Import the database and start the server to load live menu items.</p>';
});
