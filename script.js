$("#addButton").click(function () {
  $(".input-form").toggle();
});

$('#inputbtn').click(function () {

  let photo = $('.inputphoto').val()
  let name = $('.inputname').val()
  let mbti = $('.inputmbti').val()
  let tmi = $('.inputtmi').val()

  let temp_html = `
  <div class="col card-list">
    <div class="card">
      <img src="${photo}" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${mbti}
        </p>
        <p class="card-text">${tmi}
        </p>
      </div>
    </div>
</div>`
$('#card').append(temp_html);
});