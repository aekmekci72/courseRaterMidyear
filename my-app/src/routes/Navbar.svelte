<!-- Navbar.svelte -->
<script>
  import { getContext } from 'svelte';
  import { onMount } from 'svelte';

  let currentRoute = '';
  let isNavbarOpen = false;
  let isSmallScreen = false;

  const toggleNavbar = () => {
    isNavbarOpen = !isNavbarOpen;
  };

  onMount(() => {
    const { pathname } = getContext('router');
    currentRoute = pathname;

    // Check screen width on mount
    checkScreenWidth();
    
    // Listen for window resize events
    window.addEventListener('resize', checkScreenWidth);
    
    // Cleanup listener on component destruction
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  });

  const checkScreenWidth = () => {
    isSmallScreen = window.innerWidth <= 768; // Adjust the threshold as needed
  };
</script>



<style>
  .navbar {
    background-color: #FFFBF6;
    padding: 1rem;
    color: #FE502D;
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
    gap: 1.8rem;
    font-size: 1.2rem;
  }

  a {
    color: #FE502D;
    text-decoration: none;
    font-family: 'Indie Flower', cursive;
    transition: color 0.3s ease;
  }

  a:hover{
    color:#FFBD59;
  }

  /* Hide the hamburger icon for larger screens */
  .hamburger-icon {
    display: none;
  }



  /* Show the hamburger icon only for small screens */
  @media screen and (max-width: 768px) {
    .navbar {
      flex-direction: row; /* Change flex-direction to column for small screens */
    }

    .nav-links {
      display: flex;
      flex-direction: row;
      position: absolute;
      top: 70px; /* Adjust this value based on your design */
      width: 100%;
      background-color: #FFFBF6;
      z-index: 1;
    }

    .nav-links-closed {
      display: none;
    }

    .nav-links-closed a {
      display: none;
    }

    .hamburger-icon {
      display: block;
    }
  }
</style>


<div class="navbar">
  <div class="logo">STUDENT NAME HERE</div>
  <div class:nav-links={!isNavbarOpen} class:nav-links-closed={isNavbarOpen}>
    <a href="/" class:active-link={currentRoute === '/'}>Home</a>
    <a href="/Lookup" class:active-link={currentRoute === '/Lookup'}>Lookup</a>
    <a href="/Recs" class:active-link={currentRoute === '/Recs'}>Recs</a>
    <a href="/AboutUs" class:active-link={currentRoute === '/AboutUs'}>About Us</a>
  </div>
</div>
