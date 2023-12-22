$("#addButton").click(function () {
  $(".input-form").toggle();
});

$("#inputbtn").click(function (e) {
  if (e.target.tagName !== "BUTTON") {
    return;
  }

  const photoInput = $(".inputphoto");
  const nameInput = $(".inputname");
  const mbtiInput = $(".inputmbti");
  const tmiInput = $(".inputtmi");

  const photo = photoInput.val();
  const name = nameInput.val();
  const mbti = mbtiInput.val();
  const tmi = tmiInput.val();

  if (e.target.id === "enterBtn") {
    if (photo === "" || name === "" || mbti === "" || tmi === "") {
      alert("값을 입력하세요");
      return;
    }

    const temp_html = `
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
        </div>`;
    $("#card").append(temp_html);
  } else if (e.target.id === "cancelBtn") {
    $(".input-form").toggle();
  }

  photoInput.val("");
  nameInput.val("");
  mbtiInput.val("");
  tmiInput.val("");
});
