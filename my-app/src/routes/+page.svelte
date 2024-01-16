<script>
	/**
	 * @typedef {Object} Student
	 * @property {number} stu_id
	 * @property {string} stu_name_first
	 * @property {string} stu_name_last
	 * @property {string} stu_email
	 */
  
	import { onMount } from 'svelte';
	import Navbar from './Navbar.svelte';
	import Modal from './Modal.svelte';
  
	/** @type {Array<Student>} */
	let students = [];
  
	onMount(async () => {
	  try {
		const response = await fetch('http://localhost:3000/api/students');
		if (response.ok) {
		  students = await response.json();
		} else {
		  console.error('Failed to fetch students:', response.statusText);
		}
	  } catch (error) {
		console.error('Error fetching students:', error);
	  }
	});
  
	/**
	 * @param {number} studentId - The ID of the selected student
	 */
	function selectStudent(studentId) {
	  // Save the selected student ID in local storage
	  localStorage.setItem('selectedStudentId', (studentId.toString()));
	  window.location.reload();
	}
  </script>
  
  <style>
  
  </style>
  
  <Navbar />
  
  <main class="container mx-auto">
  
	<h1>Students</h1>
  
	{#if students.length > 0}
	  {#each students as student (student.stu_id)}
		<div>
		  <p>{student.stu_name_last}, {student.stu_name_first}: {student.stu_email}</p>
		  <button on:click={() => selectStudent(student.stu_id)}>Select Student</button>
		</div>
	  {/each}
	{:else}
	  <p class="no-students">No students available.</p>
	{/if}
  
  </main>
  