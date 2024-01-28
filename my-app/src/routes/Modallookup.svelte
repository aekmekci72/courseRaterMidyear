<!-- Modallookup.svelte -->
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
let searchTerm = '';
let showModal = false;
let selectedCourseName = '';

$: filteredCourses = courses.filter(
  (course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
);

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

    /** @type {Course | null} */
    export let course = null;


    export let isOpen = false;
  
    function closeModal() {
      isOpen = false;
    }
  
    // Assuming these are the relevant properties from the Course type
    let difficultyRating = 0;
    let interestRating = 0;
    let courseName='';
    let prereq='';
    let teachingStyle='';
    let desc='';
  
    // Update ratings if a course is provided
    $: if (course) {
      difficultyRating = course.r1;
      interestRating = course.r2;
      courseName=course.course_name;
      prereq = course.prereq;
        teachingStyle = course.r3;
        desc = course.description;

    }
  
    /** @type {(value: number) => void} */
    function setDifficultyRating(value) {
      difficultyRating = value;
    }
  
    /** @type {(value: number) => void} */
    function setInterestRating(value) {
      interestRating = value;
    }
  
    function submit() {
      console.log("submit");
    }



</script>
  
  {#if isOpen}
  <div class="modal">
    <div class="modal-content">
  
      {#if course}
      <h2>{courseName}</h2>
        <p>Description: {desc}</p>
        <p>Pre-requisites: {prereq}</p>
        
        <p>Difficulty Rating: {difficultyRating.toFixed(2)}</p>
        <p>Interest Rating: {interestRating.toFixed(2)}</p>
        <p>Teaching Style: {teachingStyle}</p>

      {/if}
  
      <button class="close-button" on:click={closeModal}>
        X
      </button>
    </div>
  </div>
  {/if}
  
  <style>
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
      font-size: 1.2rem;
    }
  
    .modal-content {
      position: relative;
      background: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      width: 70%;
      max-width: 400px;
      color: #bf7e71;
      font-family: "Indie Flower", cursive;
    }
  
    h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
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
  </style>
  