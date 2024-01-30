<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />


<!-- Modal.svelte -->
<script>
  import { onMount } from 'svelte';

  export let isOpen = false;
  export let courseName = '';
  export let descriptionInput = '';
  export let prereq='';
  export let isActive=true;
  export let studentId = '';

  let teachingStyles = [
  'Slideshows',
  'Lecture',
  'Code Along',
  'Interactive',
  'Project Based',
  'Worksheet Heavy',
  'Test Heavy',
];
  
  
  function closeModal() {
    isOpen = false;
  }

  let difficultyRating = 0;
  let interestRating = 0;
  let teachingStyle = '';


  /** @type {(value: number) => void} */
  function setDifficultyRating(value) {
    difficultyRating = value;
  }
    /** @type {(value: number) => void} */
  function setInterestRating(value){
    interestRating=value;
  }
  /** @type {(event: Event) => void} */
    function setTeachingStyle(event) {
      const selectElement = event.currentTarget;

      if (selectElement instanceof HTMLSelectElement) {
        teachingStyle = selectElement.value || '';
      }
    }

    function submit() {
  const testData = {
    studentId: studentId,
    courseName: courseName,
    teacherId: 1,
    r1: difficultyRating, 
    r2: interestRating,
    r3: teachingStyle,
    active: isActive ? 1 : 0,
    description: descriptionInput,
    prereq: prereq,
  };

  console.log('Sending data:', testData);

  fetch('http://localhost:3000/api/addStudentCourse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData),
  })
    .then(response => {
      console.log('Server response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('Error adding test course:', error);
    });

  closeModal();
}
</script>

{#if isOpen}
<div class="modal">
  <div class="modal-content">
    <h2>{courseName}</h2>

    <div class="survey-question">
        <label for="courseNameInput">Course Name:</label>
        <input type="text" class="inputs" id="courseNameInput" bind:value={courseName} />
      </div>

      <div class="survey-question">
        <label for="descriptionInput">Description:</label>
        <input type="text" class="inputs" id="descriptionInput" bind:value={descriptionInput} />
      </div>

      <div class="Pre-Requisites">
        <label for="prereq">Pre-Requisites:</label>
        <input type="text" class="inputs" id="prereq" bind:value={prereq} />
      </div>
          
      <div class="survey-question">
        <label>Active:</label>
        <div class="checkbox-option">
          <input type="checkbox" id="activeCheckbox" bind:checked={isActive} />
          <label for="activeCheckbox"></label>
          <span></span>
        </div>
      </div>      
      
      
      <div class="survey-question">
      <label>Difficulty:</label>
      
      <div class="star-rating">
    
      {#each [1, 2, 3, 4, 5] as starNumber}
        <input type="radio" id={"difficultyStar"+starNumber} name="rating1" value={starNumber} bind:group={difficultyRating} />
        <label for={"difficultyStar"+starNumber} on:click={() => setDifficultyRating(starNumber)}>
          <i class="{difficultyRating >= starNumber ? 'fas' : 'far'} fa-star"></i> 
        </label>
      {/each}
    
      </div>
    </div>
    
    <div class="survey-question">
    
      <label>Interest:</label>
      
      <div class="star-rating">
    
      {#each [6, 7, 8, 9, 10] as starNumber}
        <input type="radio" id={"interestStar"+starNumber} name="rating2" value={starNumber - 5} bind:group={interestRating} />
        <label for={"interestStar"+starNumber} on:click={() => setInterestRating(starNumber)}>
          <i class="{interestRating >= (starNumber - 5) ? 'fas' : 'far'} fa-star"></i>
        </label>
      {/each}
    
      </div>
    
    </div>        
    <div class="survey-question">
      <label>Teaching style:</label>
      {#each teachingStyles as style}
        <div class="checkbox-option">
          <input class="checkbox"type="checkbox" id={style} bind:group={teachingStyle} value={style} />
          <label for={style}></label>
          <span>{style}</span>
        </div>
      {/each}
    </div>
        
      <button class="close-button" on:click={closeModal}>
        <i class="fas fa-times"></i>
      </button>
    

      <button on:click={submit}>Submit</button>
    </div>
  </div>
{/if}

<style>

.inputs {
    border: 2px solid #B2A59B;  /* Adjust the width and style as needed */
}

  
.checkbox-option {
    display: flex;
    justify-content: center;
    margin-top: 1%;
    margin-bottom: 1.5%;
  }

  .checkbox-option input {
    display: none;
  }

  .checkbox-option label {
    width: 20px;
    height: 20px;
    border: 2px solid #FE502D;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-option input:checked + label:after {
    content: '\f00c'; 
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    font-size: 16px;
    color: #FE502D;
  }

  .checkbox-option span {
    font-size: 16px;
    color: #333;
  }


  #prereq {
      margin-bottom: 2%;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height:100%;
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
    width: 50%;
    max-width: 65%;
    color: #bf7e71;

    /* Add the following styles for scrollability */
    overflow-y: auto; /* Enable vertical scrolling if content exceeds the height */
    max-height: 80vh; /* Set a maximum height for the modal content */
  }
  h2 {
    font-size: 1.5em;
    margin-bottom: 20px;
  }

  .survey-question {
    margin-bottom: 2%;
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
