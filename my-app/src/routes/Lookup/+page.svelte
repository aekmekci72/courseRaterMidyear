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
	 * @property {string} tags
	 * 
	 */
  
	import Modal from '../Modallookup.svelte';
	import { onMount } from 'svelte';
	import Navbar from '../Navbar.svelte';
  
	/** @type {Array<Course>} */
	let courses = [];
	let searchTerm = '';
	let showModal = false;

/** @type {Array<string>} */
	let uniqueTags = [];

/** @type {Array<string>} */
let selectedTags = [];
	
/**
 * @type {Course | null}
 */
 let selectedCourse = null;
  
 $: filteredCourses = courses.filter(
    (course) =>
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTags.length === 0 ||
        selectedTags.every((tag) => course.tags.includes(tag)))
  );
  
	onMount(async () => {
		try {
			const response = await fetch('http://localhost:3000/api/courses');
			if (response.ok) {
			courses = await response.json();

			uniqueTags = Array.from(new Set(courses.flatMap((course) => course.tags.split(','))));
			console.log(uniqueTags);
			} else {
			console.error('Failed to fetch courses:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
		}
		});


  /**
	 * @param {string | null} tag
	 */
  function handleTagSelect(tag) {
    if (tag !== null) {
		if (!selectedTags.includes(tag)) {
		selectedTags = [...selectedTags, tag];
		}
	}
  }
	/**
	 * @param {string} tag
	 */
  function removeTag(tag) {
    selectedTags = selectedTags.filter((t) => t !== tag);
  }

  
	/**
	 * @param {Course} course
	 */
	function handleButtonClick(course) {
	  selectedCourse = course;
	  openModal();
	}
  
	function openModal() {
	  showModal = true;
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
    padding: 1.5rem;
    border-radius: 0.25rem;
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
    margin-bottom: 2rem;
    transition: transform 0.3s ease;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    text-align: left; /* Align text to the left within the card */
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
	  font-size: 1.6rem;
	}
		.search {
    padding: 0.5rem 0.5rem;
	width: 50%; /* Set a specific width for the search bar */
    border: 1px solid #B2A59B; /* Add a border for better visibility */
    border-radius: 0.25rem;
    margin: 2rem;
    color: #B2A59B;
    background-color: #F7F7F7; /* Add a background color */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow for depth */
    transition: border-color 0.3s ease; /* Add a smooth transition for the border color */
	font-family: 'Indie Flower', cursive;

		}
    /* Hover effect */
    &:hover {
        border-color: #FE502D; /* Change border color on hover */
    }

    /* Focus effect */
    &:focus {
        outline: none; /* Remove default focus outline */
        border-color: #5E4B35; /* Change border color on focus */
    }

  </style>
  
  <Navbar />
  <main class="container mx-auto">
	<h1>Lookup</h1>
	<div class="tag-filter">
		<label for="tag-dropdown">Filter by Tags:</label>
		<select id="tag-dropdown" on:change={(e) => handleTagSelect(e.target instanceof HTMLSelectElement ? e.target.value : null)}>
			<option value="" disabled selected>Select Tag</option>
		  {#each uniqueTags as tag}
			<option value={tag}>{tag}</option>
		  {/each}
		</select>
		{#each selectedTags as tag}
		  <div class="tag-tab">
			{tag}
			<button on:click={() => removeTag(tag)}>x</button>
		  </div>
		{/each}
	  </div>
  
	<input type="text" class="search" bind:value={searchTerm} placeholder="Search by course name" />
  
	{#if filteredCourses.length > 0}
	  {#each filteredCourses as course (course.course_id)}
		<div class="course-card">
		  <div class="course-info">
			<p class="course-name">{course.course_name}</p>
			<p class="course-description">{course.description}</p>
		  </div>
		  <button on:click={() => handleButtonClick(course)}>Learn More</button>
		</div>
	  {/each}
	{:else}
	  <p class="no-courses">No courses available.</p>
	{/if}
  
	<!-- Modal -->
  {#if showModal}
    <Modal bind:isOpen={showModal} bind:course={selectedCourse} />
  {/if}
	
	<style>
	  .course-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #faf4f2;
		padding: 1.5rem;
		border-radius: 0.25rem;
		box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
		margin-bottom: 2rem;
		transition: transform 0.3s ease;
		width: 50%;
		margin-left: auto;
		margin-right: auto;
		text-align: left;
	  }
  
	  .course-card:hover {
		transform: translateY(-5px); 
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
  
	  button {
		background-color: #FE502D;
		color: white;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		font-family: 'Indie Flower', cursive;
	  }
	</style>
  </main>
  