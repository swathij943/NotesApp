// Client facing scripts here
$(() => {
  // eslint-disable-next-line no-undef
  $('#fetch-password').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/login'
    })
      .done((response) => {

        const $usersList = $('#users');
        $usersList.empty();

        for (const user of response.users) {
          $(`<li class="user">`).text(user.name).appendTo($usersList);
        }
      });
  });
});
