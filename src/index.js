import axios from "axios";

const portfolioAPI = axios.create({
  baseURL: process.env.API_URL
});

const templates = {
  // template tag 를 사용한 객체들 -> 서버 db 에서 정보를 가져올 객체
  expList: document.querySelector("#experience").content
};

{
  async function experience() {
    const res = await portfolioAPI.get(
      `/experiences?category=work&_sort=id&_order=desc`
    );

    document.querySelector(".exp__ul").textContent = "";

    res.data.forEach(exp => {
      const fragment = document.importNode(templates.expList, true);
      const dateEl = fragment.querySelector(".experience-date");
      const titleEl = fragment.querySelector(".exp-title");
      const bodyEl = fragment.querySelector(".exp-body");
      dateEl.textContent = exp.body;
      titleEl.textContent = exp.name;
      bodyEl.textContent = exp.name;
      document.querySelector(".exp__ul").appendChild(fragment);
    });
  }
  experience();
}

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

$('.contact').waypoint(function () {
  $('.contact-form__div').addClass('animated fadeInLeft');
  setTimeout(function(){
    $('.form__input:first-child').addClass('animated flash');
  }, 1300);
}, {
  offset: '80%'
});

$('.projects').waypoint(function () {
    $('.proj-img:nth-child(2n)').addClass('animated slideInDown');
  // setTimeout(function () {
    $('.proj-img:nth-child(2n-1)').addClass('animated slideInUp');
  // }, 1000);
}, {
  offset: '50%'
});

// Modal Toggle on Project Section
const btnLearnMore = document.querySelector(".btn-ghost1");

btnLearnMore.addEventListener("click", e => {
  $('#exampleModal').modal("toggle");
});

// Tab control on Experiences Section 
const openTab1 = document.querySelector(".exp-item__list:nth-child(1)");
const openTab2 = document.querySelector(".exp-item__list:nth-child(2)");
const openTab3 = document.querySelector(".exp-item__list:nth-child(3)");

const openTab4 = document.querySelector(".proj-item__list:nth-child(1)");
const openTab5 = document.querySelector(".proj-item__list:nth-child(2)");
const openTab6 = document.querySelector(".proj-item__list:nth-child(3)");


openTab1.addEventListener("click", e => {
  openTab(event, "work", "exp-item__div", "exp-item__list");
});

openTab2.addEventListener("click", e => {
  openTab(event, "educational", "exp-item__div", "exp-item__list");
});

openTab3.addEventListener("click", e => {
  openTab(event, "participation", "exp-item__div", "exp-item__list");
});

openTab4.addEventListener("click", e => {
  openTab(event, "develop", "proj-item__div", "proj-item__list");
});

openTab5.addEventListener("click", e => {
  openTab(event, "planning", "proj-item__div", "proj-item__list");
});

openTab6.addEventListener("click", e => {
  openTab(event, "marketing", "proj-item__div", "proj-item__list");
});


function openTab(event, eventName, tabDiv, tabList) {
  const tabContent = document.querySelectorAll(`.${tabDiv}`);
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  const tabLinks = document.querySelectorAll(`.${tabList}`);
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }

  document.querySelector(`#${eventName}`).style.display = "block";
  event.currentTarget.className += ' active'
  document.querySelector(`#${eventName}`).className = `tab-pane ${tabDiv} fade show active`;
}




// Scroll-moving to links
$(document).ready(function () {
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#carouselExampleControls"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length ?
          target :
          $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate({
              scrollTop: target.offset().top
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            }
          );
        }
      }
    });
});