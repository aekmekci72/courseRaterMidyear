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

	import book from './book.png';

	
	const dispatcher = createEventDispatcher();
	
	/** @type {Array<Student>} */
	let students = [];
	
	/** @type {Student | null} */ 
	let loggedInUser = null;
	
	let username = '';
	let password = '';
	
	let error = '';
	
	async function fetchStudents() {
	  const response = await fetch('http://localhost:3000/api/students');
	  if (response.ok) {
		students = await response.json();
	  } else {
		console.error('Failed to fetch students'); 
		throw new Error('Failed to fetch students');
	  }
	}
	
	onMount(async () => {
	  try {
		await fetchStudents();
	  } catch (err) {
		console.log(err)
	  }
	});
	
	async function login() {
	  // Find user
	  const user = students.find(
		student => student.stu_email === username && student.stu_pass === password
	  );
	
	  // Validate
	  if (!user) {
		error = 'Invalid username or password';
		return;
	  }
	
	  // Login user
	  loggedInUser = user; 
	  dispatcher('login', user); 
	  error = '';

	  localStorage.setItem('selectedStudentId', user.stu_id.toString());
	  window.location.href = ('./Home');
	}
	
	function logout() {
	  loggedInUser = null;
	  dispatcher('logout');
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

  
	h1.log {
		font-family: 'Charmonman', cursive;
	  text-align: center;
	  font-size: 6rem;
	  margin-top: 3rem;
	  color: #FE502D;
	}
  
	.header-container {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  flex-direction: column;
	}
  
	.full-container {
	  background-color: #FFFBF6;
	}
  
	img.books-image {
	  width: 200px;
	}
  
	.container {
	  max-width:50%;
	  margin: auto;
	  padding: 2%;
	  border: 1px solid #F3EEEA;
	  border-radius: 5px;
	  background-color: #F3EEEA;
	  font-family: 'Indie Flower', cursive;
	}
  
	form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  
  label {
    margin-bottom: 10px; /* Increase margin for better separation */
  }
  input {
    width: 50%; /* Make input fields take up the full width of the container */
    box-sizing: border-box; /* Include padding and border in the width calculation */
    padding: 10px;
    margin-bottom: 15px; /* Increase margin for better separation */
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  button {
    margin-top: 20px; /* Increase margin for better separation */
    padding: 12px;
    background-color: #FE502D;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
	button:hover {
	  background-color: #FE502D;
	}
  
	.err {
	  color: #dc3545;
	  margin-top: 2%;
	  text-align: center;

	}
  
	p.reg {
		margin-top: -3%;
	  text-align: center;
	  font-weight: bold;
	  font-size: 1.5rem;
	  font-family: 'Indie Flower', cursive;
	}
  
	a {
	  color: #FE502D;
	  text-decoration: none;
	}
  
	a:hover {
	  text-decoration: underline;
	}
  
	.content-container {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}

	.full-container {
    background-color: #FFFBF6;
    padding: 2%;
  }

  .log {
    font-size: 4rem; 
    margin-top: 3%; 
  }

  .container {
    max-width: 80%;
    margin: 5% auto;
    padding: 4%;
    border: 1px solid #F3EEEA;
    border-radius: 5px;
    background-color: #F3EEEA;
    font-family: 'Indie Flower', cursive;
  }

  </style>
  
  <div class="full-container">
	<div class="header-container">
	  <h1 class="log">Rec Deck</h1>
	</div>
	
	<div class="content-container">
	  <div class="container">
		{#if loggedInUser}
		  <button on:click={logout}>Logout</button>
		{:else}
		  <form on:submit|preventDefault={login}>
			<label for="username">Username</label>
			<input bind:value={username} id="username" />
  
			<label for="password">Password</label>
			<input bind:value={password} id="password" type="password" />
  
			<button type="submit">Login</button>
		  </form>
  
		  {#if error}
			<div>
			  <p class="err">{error}</p>
			</div>
		  {/if}
		{/if}
	  </div>
	</div>
	
	<p class="reg"><a href="./Reg">Register</a></p>
  </div>
  