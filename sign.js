document.getElementById('signup-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username && password) {
      const userUID = generateUID(); // Generate a unique ID for the user
      addUserToDB(username, password, userUID)
        .then(() => {
          // Store the UID in localStorage for cross-session recognition
          localStorage.setItem('userUID', userUID);
  
          alert('Signup successful!');
          window.location.href = 'log.html'; // Redirect to login page
        })
        .catch((err) => {
          alert('Error: ' + err);
        });
    } else {
      alert('Please fill in all fields');
    }
  });