<script>
  import Navbar from '../Navbar.svelte';
  import contact from './contact.png';

  let teamMembers = [
    { name: 'John Doe', role: 'Founder' },
    { name: 'Jane Smith', role: 'Designer' },
    { name: 'Bob Johnson', role: 'Developer' },
  ];
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Charmonman&family=Indie+Flower&family=Shadows+Into+Light&display=swap');
  
  :global(body) {
    background-color: #FFFBF6;
    font-family: 'EyesomeScript', sans-serif;
    margin: 0;
  }
  
  @font-face {
    font-family: 'EyesomeScript';
    src: url('./EyesomeRegular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  header {
    text-align: center;
    padding: 20px;
    font-size: 4rem;
    font-family: 'Charmonman', cursive;
    color: #FE502D;
  }

  section {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 20px;
  }

  img {
    max-width: 60%;
    height: auto;
  }

  .text-container {
    padding: 3%;
    border: .01px dotted #FE502D;
    border-radius: 10px;
    max-width: 30%;
    text-align: left;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .team-member {
    margin-bottom: 10px;
    font-family: 'Indie Flower', cursive;
    color: #333;
  }
</style>

<Navbar />

<header>
  <h1>About Us</h1>
</header>

<section>
  <img src={contact} alt="Contact Us" />
  <div class="text-container">
    {#each teamMembers as { name, role }}
      <div class="team-member">
        <strong>{name}</strong> - {role}
      </div>
    {/each}
  </div>
</section>
