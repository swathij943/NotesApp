// Client facing scripts here

document.addEventListener('DOMContentLoaded', (e) => {

  const taskBtn = document.getElementById('newtaskbtn');

  // dynamically loaded, event delegation
  //const logoutBtn = document.getElementById('logoutbtn');

  taskBtn.addEventListener('onclick', (e) => {

    if (taskBtn.textContent.length > 0) {
      $.ajax({
        method: 'POST',
        url: '/gotochat'
      });
    }
  });

  // logoutBtn.addEventListener('onclick', (e) => {
  //   $.ajax({
  //     method: 'POST',
  //     url: '/logout'
  //   });

  // });
});

