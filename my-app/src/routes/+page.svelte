<script>
	/**
	 * @typedef {Object} Course
	 * @property {number} course_id
	 * @property {string} course_name
	 * @property {number} teacher_id
	 * @property {number} r1
	 * @property {number} r2
	 * @property {string} r3
	 * @property {number} active
	 * @property {string} description
	 * @property {string} prereq
	 */
	
	import { onMount } from 'svelte';
	
	/** @type {Array<Course>} */
	let courses = [];
	
	onMount(async () => {
	  try {
		const response = await fetch('http://localhost:3000/api/courses');
		if (response.ok) {
		  courses = await response.json();
		} else {
		  console.error('Failed to fetch courses:', response.statusText);
		}
	  } catch (error) {
		console.error('Error fetching courses:', error);
	  }
	});
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
	
	main {
	  margin-top: 5rem;
	  text-align: center;
	}
	
	h1 {
	  font-size: 4rem;
	  color: #FE502D;
	  margin-bottom: 4rem;
	  font-family: 'Charmonman', cursive;
	}
	
	.course-card {
	  background-color: #faf4f2;
	  padding: 1.5rem; /* Increased padding for better spacing */
	  border-radius: 0.25rem;
	  box-shadow:0 0 0 2px rgba(139, 69, 19, 0.2); /* Adjust opacity for a more subtle effect */
	  margin-bottom: 2rem; /* Increased margin for better separation */
	  transition: transform 0.3s ease; /* Add a smooth transition effect */
	}
	
	.course-card:hover {
	  transform: translateY(-5px); /* Lift the card slightly on hover */
	}
	
	.course-name {
	  font-size: 1.8rem;
	  font-weight: bold;
	  font-family: 'Indie Flower', cursive;
	  color: #bf7e71; /* Darkened text color for better readability */
	}
	
	.course-description {
	  color: #B2A59B; /* Darkened text color for better readability */
	  font-family: 'Indie Flower', cursive;
	  font-size: 1.4rem;
	}
	
	.no-courses {
	  color: red;
	  font-family: 'Indie Flower', cursive;
	}
  </style>
  
  <main class="container mx-auto">
	<h1>My Courses</h1>
	
	{#if courses.length > 0}
	  {#each courses as course (course.course_id)}
		<div class="course-card">
		  <p class="course-name">Course: {course.course_name}</p>
		  <p class="course-description">{course.description}</p>
		</div>
	  {/each}
	{:else}
	  <p class="no-courses">No courses available.</p>
	{/if}
  </main>
  