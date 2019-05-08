$(document).ready(function () {
  var img_holder = $("#gif_holder")
  //declare global variablef for search
  var term
  var rating
  var limit
  var theme
  //grab saved searches from locaStorage
  if (JSON.parse(localStorage.getItem("theme")) === null) {
    theme = []
  } else {
    theme = JSON.parse(localStorage.getItem("theme"))
    render_buttons();
  }
  
  function grab_gifs() {
    //grab gifs from giphys
    var apikey = "lithhVQDOaavEcxQbEX0Vywb6Bb60syr"
    var queryUrl = "http://api.giphy.com/v1/gifs/search"
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



  function repeat_check(check) {
    //checks if a theme is a repeat
    var no_repeat = true
    for (var i = 0; i < theme.length; i++) {
      if (check === theme[i])
        no_repeat = false
    }
    return no_repeat;
  }

  function render_buttons() {
  //renders the buttons on the screen
    $("#button_holder").empty();
    for (var i = 0; i < theme.length; i++) {
      var holder =$("<div>")
      holder.addClass("theme")
      var delete_button =$("<button>")
      delete_button.attr("data-to-do", i)
      delete_button.addClass("checkbox search_term button btn btn-outline-primary");
      delete_button.css("border-color", "transparent")
      delete_button.css("padding-left", 0)
      delete_button.css("top", 0)
      delete_button.text("x");
      
      var term_holder = $("<button>")
      term_holder.addClass("search_term button btn btn-outline-primary")
      term_holder.attr("data-search", theme[i])
      term_holder.text(theme[i])
      term_holder.prepend(delete_button)

      holder.append(delete_button)
      holder.append(term_holder)
   
      $("#button_holder").append(holder)
      //adjust the theme holder section
      if ( window.matchMedia("(max-width:575px)").matches) {
        height_adjust()

      }
    }

  }

  //pause gif
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
  //delete theme
  $(document).on("click",".checkbox", function () {
    var theme=$(this).attr("data-to-do")
    var new_theme=[]

    for(var i;i<theme.length;i++){
        if(i!==theme){
          new_theme.push(them[i])
        }

    }
    localStorage.setItem("theme", JSON.stringify(new_theme))
     $(this).parent().remove()
  })

  function height_adjust() {
    var height = $("#theme_list").css("height");
    var top = $("#sidebar").css("top")
    if (height !== top) {
      $("#sidebar").css("top", height)
    }
  }



//add a new theme
  $("#add_theme").on("click", function () {
    var addition = $("#theme_new").val().trim();

    $("#theme_new").val("Theme")
    if (addition.length != 0 && repeat_check(addition)) {

      theme.push(addition)
      localStorage.setItem("theme", JSON.stringify(theme))
      render_buttons();
    }
  })



  //apply filters
  $("#filter").on("click", function () {


    limit = $("#limit_info").val().trim()
    rating = $("option:selected").attr("value")
    grab_gifs("display")
  })


  //clear filters
  $("#clear_filter").on("click", function () {
    limit = null
    rating = null
    $("#limit_info").val("Limit")
    $("#inputGroupSelect01 option[value=reset]").attr('selected', 'selected');


  })

  //clear all gifs
  $("#clear_gif").on("click", function () {
    img_holder.empty()
  })


  //display all gifs with a sepecific search term
  $(document).on("click", ".search_term", function () {
    term = $(this).attr("data-search")
    grab_gifs()
  });

  // remove all theme buttons
  $("#clear_button").on("click", function () {
    $("#button_holder").empty();
    localStorage.clear()
    theme = []

  })

  //functions for responsiveness
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

 
})