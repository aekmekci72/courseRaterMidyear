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
	import Navbar from '../Navbar.svelte';
	import Modal from '../Modal.svelte';
	import Modal2 from '../Modal2.svelte';


  
	/** @type {Array<Course>} */
	let courses = [];
	let searchTerm = '';
$: filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
);
		
	/** @type {Course | null} */
	let hoveredCourse = null;



	let showAlert = false;
  


	onMount(async () => {
  const studentId = localStorage.getItem('selectedStudentId');

  if (!studentId) {
    window.location.href = './';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/getStudentCourses?studentId=${studentId}`);

    if (response.ok) {
      courses = await response.json();

	  const lastRatingTimestamp = localStorage.getItem('lastRatingTimestamp');
        const twoWeeksAgo = new Date(Date.now() - 2 * 7 * 24 * 60 * 60 * 1000); // Two weeks ago

        if (!lastRatingTimestamp || new Date(lastRatingTimestamp) < twoWeeksAgo) {
          showAlert = true;

        setTimeout(() => {
          showAlert = false;
        }, 3000);
      }
    } else {
      console.error('Failed to fetch courses:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
});

  let showModal = false;
  let showModal2=false;

  /** @type {string} */
  let selectedCourseName = '';
/**
  /** @type {string | undefined} */
  let selectedStudentId = '';
/**
   * @param {string} courseName
   * @param {string | undefined} studentId
   */
 function openModal(courseName, studentId) {
    selectedCourseName = courseName;
	selectedStudentId = studentId;
    showModal = true;
  }
  /**
  * @param {string | undefined} studentId
     */
  function openModal2(studentId) {
	selectedStudentId = studentId;
    showModal2 = true;
  }


  	/**
	 * @param {Course} course
	 */
  function handleButtonClick(course) {
	const studentId = localStorage.getItem('selectedStudentId')
    openModal(course.course_name, studentId||undefined);
  }
  
	/**
	 * @param {Course} course
	 */
	function showRatings(course) {
	  hoveredCourse = course;
	}
  
	function hideRatings() {
	  hoveredCourse = null;
	}

	function addcourse() {
    const studentId = localStorage.getItem('selectedStudentId');
    openModal2(studentId || undefined);

	}
</script>

{#if showAlert}
<script>
//   alert("Rate your courses...did you opinions change?");
</script>
{/if}
  
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
	  margin-top: 3.5rem;
	  text-align: center;
	}
  
	h1 {
	  font-size: 4rem;
	  color: #FE502D;
	  margin-bottom: 4rem;
	  font-family: 'Charmonman', cursive;
	}
  
	.course-card {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  background-color: #faf4f2;
	  padding: 1.5rem;
	  border-radius: 0.25rem;
	  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
	  margin-bottom: 2rem;
	  width: 50%;
	  margin-left: auto;
	  margin-right: auto;
	  text-align: left;
	  position: relative; /* Added position relative for absolute positioning of rating-info */
	  transition: transform 0.5s ease, box-shadow 0.5s ease; /* Increased transition time to 0.5s */

	}
  
	.course-card:hover {
		transform: translateY(-5px);
    transition: transform 0.5s ease, box-shadow 0.5s ease; /* Increased transition time to 0.5s */
	  
	}
  
	.course-name {
	  font-size: 1.8rem;
	  font-weight: bold;
	  font-family: 'Indie Flower', cursive;
	  color: #bf7e71;
	}
  
	.course-description {
	  color: #B2A59B;
	  font-family: 'Indie Flower', cursive;
	  font-size: 1.4rem;
	}
  
	.no-courses {
	  color: red;
	  font-family: 'Indie Flower', cursive;
	  font-size: 1.6rem;
	}
  
	.rating-info {
    display: none;
    flex-direction: row; 
    align-items: center; /* Center align the ratings */
    position: relative;
    top: 0; /* Align with the top of the course card */
	left:-2.2rem;
    z-index: 1;
	
    transform: translateY(10px); /* Set initial transform */

  }

  
	.course-card:hover .rating-info {
	  display: flex;
	}
  
	.rating {
  margin-bottom: 0.5rem;
  text-align: center;
  width: 9rem; /* Set a fixed width for consistent spacing */

}
  
	.rating-label {
	  font-size: 1.2rem;
	  color: #FE502D;
	  font-family: "Indie Flower", cursive;
	}
  
	.rating-value {
	  font-size: 1.4rem;
	  color: #bf7e71;
	  font-family: "Indie Flower", cursive;
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


    /* Hover effect */
    &:hover {
        border-color: #FE502D; /* Change border color on hover */
    }

    /* Focus effect */
    &:focus {
        outline: none; /* Remove default focus outline */
        border-color: #5E4B35; /* Change border color on focus */
    }
}

@media only screen and (max-width: 768px) {
    /* Styles for screens with a maximum width of 768px (adjust as needed) */

    .course-card {
      width: 100%; /* Set the width to 100% for mobile screens */
      box-shadow: none; /* Remove box shadow on mobile screens if needed */
    }

    .rating-info {
      display: none; /* Hide the rating info on mobile screens */
    }

    .course-card:hover .rating-info {
      display: none; /* Ensure rating info stays hidden on mobile screens */
    }
  }

  .add-course-button {
    background-color: #FE502D;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-family: 'Indie Flower', cursive;
	margin: auto;
  }

  </style>
  
  <Navbar />
  
  <main class="container mx-auto">
  
	<h1>My Courses</h1>

  
	<input type="text" class="search" bind:value={searchTerm} placeholder="Search by course name" />

	<button class="add-course-button" on:click={() => addcourse()}><i class="fas fa-plus"></i></button>

	{#if filteredCourses.length > 0}
		{#each filteredCourses as course (course.course_id)}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="course-card" on:mouseenter={() => showRatings(course)} on:mouseleave={() => hideRatings()}>
		  <div class="course-info">
			<p class="course-name">Course: {course.course_name}</p>
			<p class="course-description">{course.description}</p>
			<div class="rating-info">
			  <div class="rating">
				<p class="rating-label">Difficulty:</p>
				<p class="rating-value">{hoveredCourse ? hoveredCourse.r1.toFixed(2) : ''}</p>
				</div>
			  <div class="rating">
				<p class="rating-label">Interest:</p>
				<p class="rating-value">{hoveredCourse ? hoveredCourse.r2.toFixed(2) : ''}</p>
										  </div>
			  <div class="rating">
				<p class="rating-label">Teaching Style:</p>
				
				<p class="rating-value">{hoveredCourse ? hoveredCourse.r3 : ''}</p>
			  </div>
			</div>
		  </div>
		  <button on:click={() => handleButtonClick(course)}>Rate</button>
		</div>
	  {/each}
	{:else}
	  <p class="no-courses">No courses available.</p>
	{/if}

	  
	  <Modal bind:isOpen={showModal} bind:courseName={selectedCourseName} bind:studentId={selectedStudentId} />
	  <Modal2 bind:isOpen={showModal2} bind:studentId={selectedStudentId}/>

		
  </main>
  