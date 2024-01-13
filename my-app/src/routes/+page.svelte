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
	  const response = await fetch('http://localhost:3000/api/courses');
	  courses = await response.json();
	});
  </script>
  
  <main>
	<h1 class="text-3xl font-bold underline">All Courses</h1>
  
	{#if courses && courses.length > 0}
		{#each courses as course (course.course_id)}
		<div>
			<p>Course: {course.course_name}</p>
			<p>Description: {course.description}</p>
		  </div>
		  {/each}
  {:else}
	<p>No courses available.</p>
  {/if}
  </main>