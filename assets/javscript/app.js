$(document).ready(function () {
  var img_holder = $("#gif_holder")
  var term
  var rating
  var limit
  var theme
  if (JSON.parse(localStorage.getItem("theme")) === null) {
    theme = []
  } else {
    theme = JSON.parse(localStorage.getItem("theme"))
  }
  var width = window.matchMedia("(max-width:575px)")

  function grab_gifs() {
    var apikey = "lithhVQDOaavEcxQbEX0Vywb6Bb60syr"
    var queryUrl = "https://api.giphy.com/v1/gifs/search"
    queryUrl += "?" + $.param({
      "q": term,
      "api_key": apikey,
      "limit": limit,
      "rating": rating
    })
    img_holder.empty()

    $.ajax({
        url: queryUrl,
        method: 'GET',
      }).then(function (response) {

        for (var i = 0; i < response.data.length; i++) {
          var gif = $("<img>")
          gif.addClass("gif")
          gif.attr("still", response.data[i].images.fixed_height_still.url)
          gif.attr("moving", response.data[i].images.fixed_height.url)
          gif.attr("state", "active")
          gif.attr("src", response.data[i].images.fixed_height.url)
          img_holder.append(gif)
        }

      })
      .catch(function (err) {

      })
  }
  $(document).on("click", ".gif", function () {
    var that = $(this)
    if (that.attr("state") === "active") {
      that.attr("src", that.attr("still"))
      that.attr("state", "still")
    } else {
      that.attr("src", that.attr("moving"))
      that.attr("state", "active")

    }

  })

  function repeat_check(check) {
    var no_repeat = true
    for (var i = 0; i < theme.length; i++) {
      if (check === theme[i])
        no_repeat = false
    }
    return no_repeat;
  }

  function render_buttons() {
    $("#button_holder").empty();
    for (var i = 0; i < theme.length; i++) {

      var term_holder = $("<button>")
      term_holder.addClass("search_term button btn btn-outline-primary")
      term_holder.attr("data-search", theme[i])
      term_holder.text(theme[i])

      $("#button_holder").append(term_holder)
      if (width.matches) {
        height_adjust()

      }
    }

  }

  function height_adjust() {
    var height = $("#theme_list").css("height");
    var top = $("#sidebar").css("top")
    if (height !== top) {
      $("#sidebar").css("top", height)
    }
  }




  $("#add_theme").on("click", function () {
    var addition = $("#theme_new").val().trim();
    $("#theme_new").val("Theme")
    if (addition.length != 0 && repeat_check(addition)) {
      theme.push(addition)
      localStorage.setItem("theme", JSON.stringify(theme))
      render_buttons();
    }
  })


  $("#filter").on("click", function () {


    limit = $("#limit_info").val().trim()
    rating = $("option:selected").attr("value")
    grab_gifs("display")
  })

  $("#clear_filter").on("click", function () {
    limit = null
    rating = null
    $("#limit_info").val("Limit")
    $("#inputGroupSelect01 option[value=reset]").attr('selected', 'selected');


  })
  $("#clear_gif").on("click", function () {
    img_holder.empty()
  })

  $(document).on("click", ".search_term", function () {
    term = $(this).attr("data-search")
    grab_gifs()
  });

  $("#clear_button").on("click", function () {
    $("#button_holder").empty();
    localStorage.clear()
    theme = []

  })


  if (screen.width < 576) {
    height_adjust()
    $(".navbar-toggler").attr("disabled", false)
  } else {
    $(".navbar-toggler").attr("disabled", true)
  }
  $(window).resize(function () {

    if (screen.width < 576) {
      height_adjust()
      $(".navbar-toggler").attr("disabled", false)
    } else {
      $("#sidebar").css("top", 0)
      $(".navbar-toggler").attr("disabled", true)
      if ($(".collapse").hasClass("show") !== true) {
        $(".collapse").addClass("show")
      }
    }

  })

  render_buttons();
})