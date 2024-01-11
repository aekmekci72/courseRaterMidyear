<script context="module">
	export async function load() {
	  try {
		const res = await fetch('http://localhost:3000/api/courses'); // Adjust the URL accordingly
		if (!res.ok) {
		  throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
		}
		
		
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
       * @type {Array<{ name: string }>}
       */
	 export let courses;
  </script>

  
  <h1>All Courses</h1>
  
  {#if courses && courses.length > 0}
	<ul>
	  {#each courses as course (course.name)}
		<li>{course.name}</li>
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
  