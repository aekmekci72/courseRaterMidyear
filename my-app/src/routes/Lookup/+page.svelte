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
      selectedTags.every((tag) => course.tags && course.tags.includes(tag)))
);

  
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/courses');
      if (response.ok) {
        courses = await response.json();

        // Check if tags is not null before using split
        uniqueTags = Array.from(new Set(courses.flatMap((course) => (course.tags ? course.tags.split(',') : []))));
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
  // Check if a tag is selected
  if (tag !== null) {
    // Check if the tag is not already in the selectedTags array
    if (!selectedTags.includes(tag)) {
      // Add the tag to the selectedTags array
      selectedTags = [...selectedTags, tag];
    }
  }

  // Reset the dropdown to its initial state
  const dropdown = document.getElementById('tag-dropdown');
  if (dropdown !== null && dropdown instanceof HTMLSelectElement) {
    dropdown.value = "";
  }
}

    /**
     * @param {number} studentId
     * @param {number} courseId
     */
async function addStudentToCourse(studentId, courseId) {
    try {
      const response = await fetch('http://localhost:3000/api/coursestudentadd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
			studentId: studentId,
			courseId: courseId,
        }),
      });

      if (response.ok) {
        // Handle success if needed
        console.log('Student added to course successfully');
      } else {
        console.error('Failed to add student to course:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding student to course:', error);
    }
  }

  function addSelectedTagManually() {
	// Get the selected tag from the dropdown
	const dropdown = document.getElementById('tag-dropdown');

	// Check if dropdown is not null
	if (dropdown !== null && dropdown instanceof HTMLSelectElement) {
		const selectedTag = dropdown.value;

		// Check if a tag is selected
		if (selectedTag !== "" && !selectedTags.includes(selectedTag)) {
		// Add the tag to the selectedTags array
		selectedTags = [...selectedTags, selectedTag];

		// Reset the dropdown to its initial state
		dropdown.value = "";
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

.tag-filter {
	font-family: 'Indie Flower', cursive;
}

.add-tag-button {
  font-family: 'Indie Flower', cursive;
  margin-left: .5%;
}
.add-course-button{
  font-family: 'Indie Flower', cursive;
  margin-left: 2%;
}

.tag-filter {
  font-family: 'Indie Flower', cursive;
  position: relative; /* Add position relative to make sure the dropdown is positioned relative to this container */
}

#tag-dropdown {
  width: 150px; /* Set your desired width for the dropdown */
  padding: 0.5rem; /* Adjust padding as needed */
  border: 1px solid #B2A59B;
  border-radius: 0.25rem;
  max-height: 150px;
  overflow-y: auto;
}

/* Style the add-tag-button */
.add-tag-button {
  font-family: 'Indie Flower', cursive;
  margin-left: 0.5%;
}

/* Style the tag-tabs */
.tag-tab {
  display: inline-block;
  margin-right: 5px; /* Adjust margin as needed */
  background-color: #F7F7F7;
  padding: 0.2rem 0.5rem; /* Adjust padding as needed */
  border: 1px solid #B2A59B;
  border-radius: 0.25rem;
}

/* Style the search input */
.search {
  padding: 0.5rem;
  width: 50%;
  border: 1px solid #B2A59B;
  border-radius: 0.25rem;
  margin: 2rem;
  color: #B2A59B;
  background-color: #F7F7F7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
  font-family: 'Indie Flower', cursive;
}

/* Hover effect for the search input */
.search:hover {
  border-color: #FE502D;
}

/* Focus effect for the search input */
.search:focus {
  outline: none;
  border-color: #5E4B35;
}

  </style>
  
  <Navbar />
  <main class="container mx-auto">
	<h1>Lookup</h1>
	<div class="tag-filter">
  <label for="tag-dropdown">Filter by Tags:</label>
  <select id="tag-dropdown">
    <option value="" disabled selected>Select Tag</option>
    {#each uniqueTags as tag}
      <option value={tag}>{tag}</option>
    {/each}
  </select>
  
  <button on:click={addSelectedTagManually} class="add-tag-button">+</button>
  
  {#each selectedTags as tag (tag)}
    <div class="tag-tab">
      <span>{tag}</span>
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
		  <button class="add-course-button" on:click={() => {
			const studentId = localStorage.getItem('selectedStudentId');
			if (studentId !== null) {
			  addStudentToCourse(parseInt(studentId), course.course_id);
			}
		  }}>+</button>
		  
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
	  justify-content: space-between; /* Align items to the right */
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
  
	.course-info {
	  flex-grow: 1; /* Allow course-info to take up available space */
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
	  border: none;
	  border-radius: 0.25rem;
	  cursor: pointer;
	  padding: 0.5rem 1rem;
	  font-family: 'Indie Flower', cursive;
	}
  </style>
  
  
  </main>
  