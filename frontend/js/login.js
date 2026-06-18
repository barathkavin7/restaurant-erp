const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');
const email = document.getElementById('email');
const password = document.getElementById('password');
const rememberMe = document.getElementById('rememberMe');

document.querySelectorAll('.demo-strip button').forEach((button) => {
  button.addEventListener('click', () => {
    email.value = button.dataset.email;
    password.value = '';
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = 'Signing you in...';
  try {
    const data = await RestaurantAPI.post('/api/auth/login', {
      email: email.value,
      password: password.value
    });
    RestaurantAPI.setSession(data.token, data.user, rememberMe.checked);
    window.location.href = '/dashboard.html';
  } catch (error) {
    message.textContent = error.message;
  }
});
