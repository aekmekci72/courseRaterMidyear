<!-- Navbar.svelte -->
<script>
</script>

<style>
  .navbar {
    background-color: #FE502D;
    padding: 1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'Indie Flower', cursive;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-family: 'Indie Flower', cursive;
  }
</style>

<div class="navbar">
  <div class="logo">My Website</div>
  <div class="nav-links">
    <a href="routes/about/page.svelte">Courses</a>
  </div>
</div>
