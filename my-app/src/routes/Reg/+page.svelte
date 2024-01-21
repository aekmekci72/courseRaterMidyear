<script>
    /**
     * @typedef {Object} Student 
     * @property {number} stu_id
     * @property {string} stu_name_first
     * @property {string} stu_name_last
     * @property {string} stu_email
     * @property {string} stu_pass
     */
  
    import { onMount } from 'svelte';
  
    /** @type {Array<Student>} */
    let students = [];
  
    let firstName = '';
    let lastName = '';
    let username = '';
    let password = '';
    let confirmPassword = '';
  
    let error = '';
  
    async function fetchStudents() {
      try {
        const response = await fetch('http://localhost:3000/api/students');
        if (response.ok) {
          students = await response.json();
          console.log('SUCCESS');
        } else {
          console.error('Failed to fetch students');
          throw new Error('Failed to fetch students');
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    onMount(fetchStudents);
  
    async function register() {
      // Validate inputs
      if (!firstName || !lastName || !username || !password || !confirmPassword) {
        error = 'Please fill in all fields';
        return;
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        error = 'Passwords do not match';
        return;
      }
  
      // Prepare user data
      const userData = {
        stu_name_first: firstName,
        stu_name_last: lastName,
        stu_email: username,
        stu_pass: password,
};

    // Make a POST request to the server
    fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
</script>
  
  <style>
  
    .container {
      max-width: 400px;
      margin: auto;
    }
  
    h1 {
      text-align: center;
      color: #fe502d;
    }
  
    form {
      display: flex;
      flex-direction: column;
    }
  
    label {
      margin-top: 10px;
      font-weight: bold;
    }
  
    input {
      margin-bottom: 15px;
      padding: 8px;
      font-size: 16px;
    }
  
    button {
      background-color: #fe502d;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  
    .err {
      color: #fe502d;
    }
  </style>
  
  <div class="container">
    <h1>Registration</h1>
    <form on:submit|preventDefault={register}>
      <label for="firstName">First Name</label>
      <input bind:value={firstName} id="firstName" />
  
      <label for="lastName">Last Name</label>
      <input bind:value={lastName} id="lastName" />
  
      <label for="username">Username</label>
      <input bind:value={username} id="username" />
  
      <label for="password">Password</label>
      <input bind:value={password} id="password" type="password" />
  
      <label for="confirmPassword">Confirm Password</label>
      <input bind:value={confirmPassword} id="confirmPassword" type="password" />
  
      <button type="submit">Register</button>
    </form>
  
    {#if error}
      <div>
        <p class="err">{error}</p>
      </div>
    {/if}
  </div>
  