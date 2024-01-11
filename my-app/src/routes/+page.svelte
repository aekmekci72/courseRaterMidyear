<script>
	/**
	 * @type {any}
	 */
	export let courses;
  </script>
  
  <h1>All Courses</h1>
  
  {#if courses && courses.length > 0}
	<ul>
	  {#each courses as course}
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
  