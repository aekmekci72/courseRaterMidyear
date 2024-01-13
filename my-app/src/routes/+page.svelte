<!-- <script context="module">
	export async function load() {
	  try {
		const res = await fetch('http://localhost:3000/api/courses');
		if (!res.ok) {
		  throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
		}
		console.log("Fetch pass");
  
		const courses = await res.json();
		console.log('Courses in load function:', courses);
		return { props: { courses } };
		
	  } catch (error) {
		console.error('Error fetching courses:', error);
		return { props: { courses: [] } };
	  }
	}
  </script>
  
  
  <script>
	/**
       * @type {Array<{ id: number, name: string, teacher: string }>}
       */
	 export let courses;
  </script>

  <h1>All Courses</h1>
  
  {#if courses && courses.length > 0}
  <ul>
    {#each courses as { name }}
      <li>{name}</li>
    {/each}
  </ul>
{:else}
  <p>No courses available.</p>
{/if}
  
  
  <style lang="postcss">
	@font-face {
	  font-family: 'EyesomeScript';
	  src: url('EyesomeScript.otf') format('opentype');
	}
  
	.custom-font {
	  font-family: 'EyesomeScript', sans-serif;
	}
  
	:global(html) {
	  background-color: #FFFBF6;
	}
  </style>
   -->

   <script>
	/**
	 * @typedef {Object} Course
	 * @property {number} id - The ID of the course.
	 * @property {string} name - The name of the course.
	 * @property {string} teacher - The name of the teacher for the course.
	 */
  
	import { onMount } from 'svelte';
  
	/** @type {Array<Course>} */
	let courses = [];
  
	onMount(async () => {
	  const response = await fetch('http://localhost:3000/api/courses');
	  courses = await response.json();
	});
  </script>
  
  <main>
	{#each courses as course (course.id)}
	  <div>
		<p>Course: {course.name}</p>
		<p>Teacher: {course.teacher}</p>
	  </div>
	{/each}
  </main>
  