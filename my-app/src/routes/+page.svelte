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

	.container {
	  /* display: flex; */
	  /* justify-content: center; */
	  /*align-items: center;*/
	  font-family: "Indie Flower", cursive;
	}
  
	form {
	  max-width: 300px;
	  align-items: right;
	  align-content: right;
	  align-self: right;
	  margin: 0 auto;
	  padding: 20px;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
  
	label {
	  display: block;
	  margin-bottom: 5px;
	}
  
	input {
	  width: 100%;
	  padding: 8px;
	  margin-bottom: 10px;
	  box-sizing: border-box;
	  border: 1px solid #ddd;
	  border-radius: 3px;
	}
  
	button {
	  background-color: #FE502D;
	  color: white;
	  padding: 10px 15px;
	  border: none;
	  border-radius: 5px;
	  cursor: pointer;
	}
  
	button:hover {
	  background-color: #bf7e71;
	}
  
	p {
	  color: #ff0000;
	}
  
	.err {
		
	}

	@font-face {
	  font-family: 'EyesomeScript';
	  src: url('./EyesomeRegular.otf') format('opentype');
	  font-weight: normal;
	  font-style: normal;
	}


	.reg{
		font-size: 4rem;
	  color: #FE502D;
	  margin-bottom: 4rem;
	  font-family: 'Charmonman', cursive;
	  text-align: right;


	}

	.log{
		font-size: 4rem;
	  color: #FE502D;
	  margin-bottom: 4rem;
	  font-family: 'Charmonman', cursive;

		text-align: center;
	}


	</style>
		  <h1 class="log">Rec Deck</h1>

	<div class="container">
	{#if loggedInUser}
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
  <h1 class="reg"><a href="./Reg">Register</a></h1>

  