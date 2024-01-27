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
    import { createEventDispatcher } from 'svelte';
	
	  const dispatcher = createEventDispatcher();
	
  
    /** @type {Array<Student>} */
    let students = [];
    /** @type {Student | null} */ 
    let loggedInUser = null;

  
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
    async function login() {
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
      const user = students.find(
        student => student.stu_email === username && student.stu_pass === password
      );

    if (!user) {
      error = 'Invalid username or password';
      return;
    }

    loggedInUser = user; 
    dispatcher('login', user); 
    error = '';

    localStorage.setItem('selectedStudentId', user.stu_id.toString());
    const storedStudentId = localStorage.getItem('selectedStudentId');
    window.location.href = ('./Home');
  }

  
    async function register() {
  if (!firstName || !lastName || !username || !password || !confirmPassword) {
    error = 'Please fill in all fields';
    return;
  }

  if (password !== confirmPassword) {
    error = 'Passwords do not match';
    return;
  }

  const isUsernameTaken = students.some(student => student.stu_email === username);

  if (isUsernameTaken) {
    error = 'Username (email) is already taken';
    return;
  }

  if (password.length < 8 || !/[A-Z]/.test(password)) {
    error = 'Password must be at least 8 characters long and contain at least one uppercase letter';
    return;
  }

  const userData = {
    stu_name_first: firstName,
    stu_name_last: lastName,
    stu_email: username,
    stu_pass: password,
  };

  try {
    // Make a POST request to register the user
    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      await login(); 
    } else {
      console.error('Failed to register user');
      throw new Error('Failed to register user');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

    
</script>
  
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Charmonman&family=Indie+Flower&family=Shadows+Into+Light&display=swap');

  :global(body) {
    background-color: #FFFBF6;
    font-family: 'EyesomeScript', sans-serif;
  }

  @font-face {
    font-family: 'EyesomeScript';
    src: url('./EyesomeRegular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  .title {
    color: #fe502d;
    font-family: 'Charmonman', cursive;
    text-align: center;
    font-size: 5rem;
    margin-top: 4%;
  }

  .container {
    max-width: 40%;
    margin: auto;
    margin-top: 2%;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    font-family: 'Indie Flower', cursive;
    background-color: #F3EEEA;
    margin-bottom: 2%;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-top: 10px;
  }

  input {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #D0D4CA;
    border-radius: 4px;
  }

  button {
    background-color: #fe502d;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .err {
    color: #fe502d;
    margin-top: 10px;
  }
</style>

<h1 class="title">Registration</h1>

<div class="container">
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
