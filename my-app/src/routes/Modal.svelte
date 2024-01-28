<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />


<!-- Modal.svelte -->
<script>
  import { onMount } from 'svelte';

  export let isOpen = false;
  export let courseName = '';
  export let studentId = '';
  
  
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

  function submit(){
    const data = {
      studentId,
      courseName,
      difficultyRating,
      interestRating,
      teachingStyle
    };
    console.log(data);

    // Make a POST request to the server
    fetch('http://localhost:3000/api/updateRatings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    closeModal();
  }
</script>

{#if isOpen}
<div class="modal">
  <div class="modal-content">
    <h2>{courseName}</h2>

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
      <select bind:value={teachingStyle} on:change={setTeachingStyle}>
        <option value="Slideshows">Slideshows</option>
        <option value="Lecture">Lecture</option>
        <option value="Code Along">Code Along</option>
        <option value="Interactive">Interactive</option>
        <option value="Project Based">Project Based</option>
        <option value="Worksheet Heavy">Worksheet Heavy</option>
        <option value="Test Heavy">Test Heavy</option>
      </select>
    </div>

      <button class="close-button" on:click={closeModal}>
        <i class="fas fa-times"></i>
      </button>
    

      <button on:click={submit}>Submit</button>
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
    font-family: "Indie Flower", cursive;
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
