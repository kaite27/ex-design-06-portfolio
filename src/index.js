import axios from "axios";

const namedAPI = axios.create({
  baseURL: process.env.API_URL
});

const templates = {
  // template tag 를 사용한 객체들 -> 서버 db 에서 정보를 가져올 객체
  // commentList: document.querySelector("#comments").content
};


/* Mobile navigation */
$(document).ready(function () {
  $(".js--nav-icon").click(function () {
    const icon = $(".js--nav-icon i");
    const siteMenu = $(".main-nav");
    const siteMenuList = $(".main-nav li");

    if (icon.hasClass("fa-bars")) {
      icon.addClass("fa-times");
      icon.removeClass("fa-bars");
      siteMenu.addClass("js--main-nav")
      siteMenuList.addClass("js--main-nav__li")
      // siteMenu.css("display", "block")
    } else {
      icon.addClass("fa-bars");
      icon.removeClass("fa-times");
      siteMenu.removeClass("js--main-nav")
      siteMenuList.removeClass("js--main-nav__li")
      // siteMenu.css("display", "none")
    }
  });
});

// Scroll animations
$('.experiences').waypoint(function () {
  $('.tab-content ul').addClass('animated fadeInDown');
}, {
  offset: '80%'
});

const btnLearnMore = document.querySelector(".btn-ghost1");

btnLearnMore.addEventListener("click", e => {
  console.log('its clicked');
  $('#exampleModal').modal("toggle");
});