window.onload = function() {
    const userUID = localStorage.getItem('userUID');
    if (userUID) {
      document.getElementById('welcome-message').innerText = `Welcome back, user with UID: ${userUID}`;
    } else {
      window.location.href = 'log.html'; // Redirect to login if no UID is found
    }
  
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('userUID');
      window.location.href = 'log.html'; // Redirect to login page after logout
    });
  };
  