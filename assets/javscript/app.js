$(document).ready(function () {
  var img_holder = $("#gif_holder")
  var term
  var rating
  var limit
  var theme = [];

  function grab_gifs(purpose) {
    var apikey = "lithhVQDOaavEcxQbEX0Vywb6Bb60syr"
    var queryUrl = "http://api.giphy.com/v1/gifs/search"
    console.log(limit)
    console.log(rating)
    queryUrl += "?" + $.param({
      "q": term,
      "api_key": apikey,
      "limit": limit,
      "rating": rating
    })
    console.log(queryUrl)
    img_holder.empty()

    $.ajax({
        url: queryUrl,
        method: 'GET',
      }).then(function (response) {
        if (purpose === "check") {
          if (response.length === 0) {
            return false;

          }
        } else {

          for (var i = 0; i < response.data.length; i++) {
            var gif = $("<img>")
            gif.addClass("gif")
            gif.attr("still", response.data[i].images.fixed_height_still.url)
            gif.attr("moving", response.data[i].images.fixed_height.url)
            gif.attr("state", "active")
            gif.attr("src", response.data[i].images.fixed_height.url)
            img_holder.append(gif)
            console.log(gif.attr("state"))
          }
          $(".gif").on("click", pause_gifs)
        }

      })
      .fail(function (err) {
        throw err;
      })
  }

  function pause_gifs() {
    var that = $(this)
    if (that.attr("state") === "active") {
      that.attr("src", that.attr("still"))
      that.attr("state", "still")
    } else {
      that.attr("src", that.attr("moving"))
      that.attr("state", "active")

    }
  }

  function repeat_check(check) {
    var no_repeat = true
    for (var i = 0; i < theme.length; i++) {
      if (check === theme[i].attr("data-search"))
        no_repeat = false
    }
    console.log(no_repeat)
    return no_repeat;
  }

  // function hits(check) {
  //   var hit = true
  //   term = check
  //   var apikey = "lithhVQDOaavEcxQbEX0Vywb6Bb60syr"
  //   var queryUrl = "http://api.giphy.com/v1/gifs/search"
  //   queryUrl += "?" + $.param({
  //     "q": term,
  //     "api_key": apikey,
  //   })
  //   console.log(queryUrl)
  //   img_holder.empty()
  //   $.ajax({
  //     url: queryUrl,
  //     method: 'GET',
  //   }).then(function (response) {
  //     console.log(response)
  //     console.log(response.data.length)
   
  //     if (response.data.length === 0) {
  //       hit = false
  //     }
  //     rating = null;
  //     term = null;
  //   return hit;
     
  //   })
  //   console.log(hit)
  //   return hit;
  // }
  $("#add_theme").on("click", function () {
    var addition = $("#theme_new").val().trim();
    $("#theme_new").val("Theme")
    // console.log(addition.length)
    // console.log(hits(addition))
    // && hits(addition)
    if (addition.length != 0 && repeat_check(addition) ) {
      console.log(1)
      $("#button_holder").empty();
      var term_holder = $("<button>")
      term_holder.addClass("search_term button btn btn-outline-primary")
      term_holder.attr("data-search", addition)
      term_holder.text(addition)
      // theme=JSON.parse(localStorage.getItem("theme"))
      theme.push(term_holder)
      // localStorage.setItem("theme", JSON.stringify(theme))
      for (var i = 0; i < theme.length; i++) {
        console.log(theme[i])
        $("#button_holder").append(theme[i])
      }
    }
  })


  $("#filter").on("click", function () {

    console.log($("option:selected").attr("value"))
    limit = $("#limit_info").val().trim()
    rating = $("option:selected").attr("value")
    grab_gifs("display")
  })

  $("#clear_filter").on("click", function () {
    limit = null
    rating = null
    $("#limit_info").val("Limit")
    $("#inputGroupSelect01").prop("selectedIndex",0)

  })
  $("#clear_gif").on("click", function () {
    img_holder.empty()
  })

  $(document).on("click", ".search_term", function () {
    term = $(this).attr("data-search")
    grab_gifs()
  });


  // localStorage.clear()
})