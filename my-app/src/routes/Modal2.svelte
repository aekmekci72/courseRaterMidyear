<script>
  /**
   * @typedef {Object} Course
   * @property {number} course_id
   * @property {string} course_name
   */

  export let isOpen = false;
  export let studentId = ''; // Assuming you have a way to set the student ID

  function closeModal() {
    isOpen = false;
  }

  /**
   * @param {number} courseId
   */
  async function addCourseToStudent(courseId) {
    // Implement the logic to add the selected course to the student
    // Make an API request to add the course to the student
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

  import { onMount } from 'svelte';

  /**
     * @type {any[]}
     */
  let courses = [];

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/courses`);

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

  .error-message {
    color: red;
  }
.checkbox-option {
    display: flex;
    align-items: center;
    align-self: center;
    align-content: center;
    margin-bottom: 10px;
    margin-left: 30%;
  }

  .checkbox-option input {
    display: none;
  }

  .checkbox-option label {
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid #FE502D;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
  }

  .checkbox-option input:checked + label:after {
    content: '\f00c'; /* Unicode for checkmark (Font Awesome) */
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    font-size: 16px;
    color: #FE502D;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .checkbox-option span {
    font-size: 16px;
    color: #333;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Indie Flower", cursive;
    font-size: 1.2rem;
  }

  .modal-content {
    position: relative;
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    width: 60%; /* Adjusted width */
    max-width: 800px; /* Set a max width for better readability */
    max-height: 70vh; /* Set a max height to enable scrolling */
    overflow-y: auto; /* Enable vertical scrolling */
    color: #bf7e71;
  }

  p, button {
    display: inline-block;
    vertical-align: middle;
  }

  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .survey-question {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .star-rating {
    display: flex;
    justify-content: center; 
    gap: 8px;
    margin-bottom: 16px;
  }

  .star-rating input {
    display: none;
  }

  li {
    margin-bottom: 10px;
  }


  p {
    margin-right: 10px;
  }

  .star-rating label {
    cursor: pointer;
    font-size: 24px; 
    color: #ffd700; 
  }

  .star-rating input:checked ~ label,
  .star-rating label:hover {
    color: #ffac33; /* a slightly darker shade when hovered or checked */
  }

  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 16px;
  }


  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #bf7e71;
    padding: 0;
  }

  .close-button:hover {
    color: #e98d7a;
  }

  button {
    background-color: #FE502D;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }


  
</style>


{#if isOpen}
  <div class="modal">
    <div class="modal-content">
      <span class="close" on:click={closeModal}>&times;</span>
      <h2>Add Course</h2>
      <p>Select a course to add:</p>

      <!-- Your scrolling course list here -->
      <ul>
        {#each courses as course (course.course_id)}
          <li>
            <div>
              <p>{course.course_name}</p>
              <button on:click={() => addCourseToStudent(course.course_id)}>Add</button>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}