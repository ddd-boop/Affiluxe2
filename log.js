document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username && password) {
      getUserFromDB(username)
        .then((user) => {
          if (user && user.password === password) {
            // Store the UID in localStorage for future recognition
            localStorage.setItem('userUID', user.userUID);
  
            alert('Login successful!');
            window.location.href = 'dash.html'; // Redirect to the dashboard or home page
          } else {
            alert('Invalid username or password');
          }
        })
        .catch((err) => {
          alert('Error: ' + err);
        });
    } else {
      alert('Please fill in all fields');
    }
  });