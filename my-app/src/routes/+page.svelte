<script context="module" lang="ts">
	interface Course {
	  id: string;
	  name: string;
	  teacher: string;
	}
  
	export async function load() {
	  try {
		const res = await fetch('/api/courses');
		if (!res.ok) {
		  throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);
		}
  
		const courses: Course[] = await res.json();
		console.log('Courses in load function:', courses);
		return { props: { courses } };
	  } catch (error) {
		console.error('Error fetching courses:', error);
		return { props: { courses: [] as Course[] } };
	  }
	}
  </script>
  
  <script lang="ts">
	interface Course {
	  id: string;
	  name: string;
	  teacher: string;
	}
  
	export let courses: Course[] = [];
  
	console.log('Courses in Svelte component:', courses);
  
	console.log('Is courses array empty?', courses.length === 0);
  </script>
  
  <h1>All Courses</h1>
  
  <ul>
	{#each courses as course (course.id)}
	  <li>{course.name}</li>
	{/each}
  </ul>
  
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
s  