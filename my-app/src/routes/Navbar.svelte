<!-- Navbar.svelte -->
<script>
  /**
   * @typedef {string} StudentName
   * @property {number} stu_id
   * @property {string} stu_name_first
   * @property {string} stu_name_last
   * @property {string} stu_email
   */
  import { getContext } from 'svelte';
  import { onMount, afterUpdate, setContext } from 'svelte';

  /** @type {StudentName} */
  let studentName = '';
  
	onMount(async () => {
    fetchStudentName();
	});

  let currentRoute = '';
  let isNavbarOpen = false;
  let isSmallScreen = false;

  const toggleNavbar = () => {
    isNavbarOpen = !isNavbarOpen;
  };

  onMount(() => {
    const { pathname } = getContext('router');
    currentRoute = pathname;

    // Fetch student name on mount
    fetchStudentName();

  });

  afterUpdate(() => {
    // Fetch student name after each update
    fetchStudentName();
  });


  const fetchStudentName = async () => {
    // Retrieve studentId from local storage
    const studentId = localStorage.getItem('selectedStudentId');

    if (studentId) {
      try {
        // Make a call to the getStunamebyid endpoint to fetch the student name
        const response = await fetch(`http://localhost:3000/api/getStuNameById?studentId=${studentId}`);

        if (response.ok) {
          const data = await response.json();
          studentName = data.studentName;
        } else {
          console.error('Failed to fetch student name:', response.statusText);
          studentName = ''; // Set to empty string on error
        }
      } catch (error) {
        console.error('Error fetching student name:', error);
        studentName = ''; // Set to empty string on error
      }
    } else {
      studentName = ''; // Reset studentName if no studentId in local storage
    }
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
      justify-content: center;
      margin-bottom: 6rem;
    }

    .nav-links {
      display: flex;
      flex-direction: row;
      position: absolute;
      top: 70px; /* Adjust this value based on your design */
      width: 100%;
      background-color: #FFFBF6;
      z-index: 1;
      justify-content: center;

    }

    .nav-links-closed {
      display: none;
      justify-content: center;

    }

    .nav-links-closed a {
      display: none;
      justify-content: center;

    }
  }
</style>


<div class="navbar">
  <div class="logo">{studentName || 'STUDENT NAME HERE'}</div>
  <div class:nav-links={!isNavbarOpen} class:nav-links-closed={isNavbarOpen}>
    <a href="/Home" class:active-link={currentRoute === '/Home'}>Home</a>
    <a href="/Lookup" class:active-link={currentRoute === '/Lookup'}>Lookup</a>
    <a href="/Recs" class:active-link={currentRoute === '/Recs'}>Recs</a>
    <a href="/AboutUs" class:active-link={currentRoute === '/AboutUs'}>About Us</a>
  </div>
</div>
