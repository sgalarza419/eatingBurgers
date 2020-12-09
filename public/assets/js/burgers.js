// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $.ajax("/burgers", {
    type: "GET"
  }).then(function(data) {
    var devouredElem = $("#devouredBurgers");
    var nodevouredElem = $("#notDevouredBurgers");

    var burgers = data.burgers;
    var len = burgers.length;

    for (var i = 0; i < len; i++) {
      var new_elem =
        "<li>" +
        burgers[i].id + 
        ". "+burgers[i].name +
        "<button class='change-devoured' data-id='" +
        burgers[i].id +
        "' data-newdevoured='" +
        !burgers[i].devoured +
        "'>";

      if (burgers[i].devoured) {
        new_elem += "BURGER TIME!";
      } else {
        new_elem += "IM FULL!";
      }

      new_elem += "</button>";

      new_elem +=
        "<button class='delete-burger' data-id='" +
        burgers[i].id +
        "'>DELETE!</button></li>";

      if (burgers[i].devoured) {
        devouredElem.append(new_elem);
      } else {
        nodevouredElem.append(new_elem);
      }
    }
  });

  $(document).on("click", ".change-devoured", function(event) {
    var id = $(this).data("id");
    var newdevoured = $(this).data("newdevoured")===true;

    var newdevouredState = {
      devoured: newdevoured
    };

    // Send the PUT request.
    $.ajax("/burgers/" + id, {
      type: "PUT",
      data: JSON.stringify(newdevouredState),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("changed devoured to", newdevoured);
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(".create-form").on("submit", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      name: $("#ca")
        .val()
        .trim(),
      devoured: $("[name=devoured]:checked")
        .val()
        .trim()
    };

    // Send the POST request.
    $.ajax("/burgers", {
      type: "POST",
      data: JSON.stringify(newBurger),
      dataType:'json',
      contentType: 'application/json'
    }).then(function() {
      console.log("created new burger");
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $(document).on("click", ".delete-burger", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/burgers/" + id, {
      type: "DELETE"
    }).then(function() {
      console.log("deleted burger", id);
      // Reload the page to get the updated list
      location.reload();
    });
  });
});
