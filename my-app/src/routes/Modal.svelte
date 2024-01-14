<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />


<!-- Modal.svelte -->
<script>
  export let isOpen = false;
  export let courseName = '';

  function closeModal() {
    isOpen = false;
  }

  let rating = 0;

  /** @type {(value: number) => void} */
  function setRating(value) {
    rating = value;
  }
</script>

{#if isOpen}
<div class="modal">
  <div class="modal-content">
    <h2>{courseName}</h2>

      <div class="survey-question">
        <label>Difficulty:</label>
        <div class="star-rating">
          <input type="radio" id="star1" name="rating1" value="1" />
          <label for="star1" on:click={() => setRating(1)}><i class="fas fa-star" class:filled={rating >= 1}></i></label>
          <input type="radio" id="star2" name="rating1" value="2" />
          <label for="star2" on:click={() => setRating(2)}><i class="fas fa-star" class:filled={rating >= 2}></i></label>
          <input type="radio" id="star3" name="rating1" value="3" />
          <label for="star3" on:click={() => setRating(3)}><i class="fas fa-star" class:filled={rating >= 3}></i></label>
          <input type="radio" id="star4" name="rating1" value="4" />
          <label for="star4" on:click={() => setRating(4)}><i class="fas fa-star" class:filled={rating >= 4}></i></label>
          <input type="radio" id="star5" name="rating1" value="5" />
          <label for="star5" on:click={() => setRating(5)}><i class="fas fa-star" class:filled={rating >= 5}></i></label>
                  </div>
      </div>

      <div class="survey-question">
        <label>Interest:</label>
        <div class="star-rating">
          <input type="radio" id="star6" name="rating2" value="1" />
          <label for="star6"><i class="fas fa-star"></i></label>
          <input type="radio" id="star7" name="rating2" value="2" />
          <label for="star7"><i class="fas fa-star"></i></label>
          <input type="radio" id="star8" name="rating2" value="3" />
          <label for="star8"><i class="fas fa-star"></i></label>
          <input type="radio" id="star9" name="rating2" value="4" />
          <label for="star9"><i class="fas fa-star"></i></label>
          <input type="radio" id="star10" name="rating2" value="5" />
          <label for="star10"><i class="fas fa-star"></i></label>
        </div>
      </div>

      <div class="survey-question">
        <label>Teaching style:</label>
        <select>
          <option value="option1">Slideshows</option>
          <option value="option2">Lecture</option>
          <option value="option3">Code Along</option>
          <option value="option3">Interactive</option>
          <option value="option3">Project Based</option>
          <option value="option3">Worksheet heavy</option>
          <option value="option3">Test heavy</option>
          
        </select>
      </div>

      <button on:click={closeModal}>Close Modal</button>
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
  }

  .modal-content {
    background: #fff;
    padding: 40px; 
    border-radius: 8px;
    opacity: 0.9;
  }

  .survey-question {
    margin-bottom: 20px;
  }

  .star-rating {
    display: flex;
  }

  .star-rating input {
    display: none;
  }

  .star-rating label {
    cursor: pointer;
    font-size: 24px; 
        color: #ffd700; 
  }

  .star-rating input:checked ~ label {
    color: #ffd700; 
  }
</style>
