document.querySelectorAll('#headerOrderBtn, #heroOrderBtn')
  .forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const data = await RestaurantAPI.post('/api/auth/login', {
          email: 'customer@restaurant.com',
          password: 'abcd1234'
        });

        RestaurantAPI.setSession(
          data.token,
          data.user,
          false
        );

        window.location.href = '/dashboard.html';
      } catch (error) {
        alert('Unable to open ordering page');
        console.error(error);
      }
    });
  });

