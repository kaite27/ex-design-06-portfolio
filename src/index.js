import axios from "axios";
import "@babel/polyfill";
import {
  tmpdir
} from "os";
import { async } from "q";

const portfolioAPI = axios.create({
  baseURL: process.env.API_URL
});

const templates = {
  // template tag 를 사용한 객체들 -> 서버 db 에서 정보를 가져올 객체
  expList: document.querySelector("#experience").content,
  projList: document.querySelector("#project").content,
  projModal: document.querySelector("#proj-modal").content
};

{
  experience("work");
  project("develop");
}

async function experience(cat) {
  const res = await portfolioAPI.get(
    `/experiences?category=${cat}&_sort=id&_order=desc`
  );

  document.querySelector(".exp__ul").textContent = "";
  res.data.forEach(exp => {
    const fragment = document.importNode(templates.expList, true);
    const dateEl = fragment.querySelector(".experience-date");
    const titleEl = fragment.querySelector(".exp-title");
    const bodyEl = fragment.querySelector(".exp-body");
    dateEl.textContent = exp.date;
    titleEl.textContent = exp.title;

    // Split content by '\n' and set a new p element to appen it to bodyEl
    const divied = exp.body.split('\n');
    for(let i = 0; i < divied.length; i++){
      const text = document.createElement('p');
      text.textContent = divied[i];
      bodyEl.appendChild(text);
    }
    document.querySelector(".exp__ul").appendChild(fragment);
  });
}

async function project(cat) {
  const res = await portfolioAPI.get(
    `/projects?category=${cat}`
  );

  document.querySelector(".proj-dev").textContent = "";
  res.data.forEach(proj => {
    const fragment = document.importNode(templates.projList, true);
    const mainImgEl = fragment.querySelector(".proj-img__img");
    const titleEl = fragment.querySelector(".proj-title");
    const btnLearnMore = fragment.querySelector(".btn-ghost");
    const firstIcon = fragment.querySelector(".first-icon");
    const secondIcon = fragment.querySelector(".second-icon");

    mainImgEl.setAttribute("src", `${proj.mainImg}`);
    titleEl.textContent = proj.title;
    firstIcon.className += ` ${proj.firstIcon}`;
    secondIcon.className += ` ${proj.secIcon}`;
    
    document.querySelector(".proj-dev").appendChild(fragment);

    btnLearnMore.addEventListener("click", async e => {
      modalPopUp(proj.id);
    })
  })
}

// function to pop-up a modal on project Section
async function modalPopUp(id) {
  const res = await portfolioAPI.get(`/projects/${id}`);
  document.querySelector(".modal-dialog").textContent = "";

  const fragment = document.importNode(templates.projModal, true);
  const modalTitleEl = fragment.querySelector(".modal-proj-title");
  const modalSubEl = fragment.querySelector(".modal-subtitle");
  const modalBodyEl = fragment.querySelector(".modal-text");
  const firstImageEl = fragment.querySelector(".carousel-first");
  const secondImageEl = fragment.querySelector(".carousel-sec");
  const thirdImageEl = fragment.querySelector(".carousel-third");
  const firstIconEl = fragment.querySelector(".modal-first__btn");
  const secondIconEl = fragment.querySelector(".modal-second__btn");

  modalTitleEl.textContent = res.data.title;
  modalSubEl.textContent = res.data.subtitle;
  firstImageEl.setAttribute("src", `${res.data.mainImg}`);
  secondImageEl.setAttribute("src", `${res.data.secImg}`);
  thirdImageEl.setAttribute("src", `${res.data.thirdImg}`);
  firstIconEl.setAttribute("href", `${res.data.gitUrl}`);
  secondIconEl.setAttribute("href", `${res.data.siteUrl}`);

  const divied = res.data.body.split('\n');
  for(let i = 0; i < divied.length; i++){
    const text = document.createElement('p');
    text.textContent = divied[i];
    modalBodyEl.appendChild(text);
  }
  if(res.data.category !== "develop") {
    firstIconEl.style.display = "none";
  }
  document.querySelector(".modal-dialog").appendChild(fragment);

  // Modal Toggle on Project Section
  $('#exampleModal').modal("toggle");
}

// send form to server
const name = document.querySelector('.form-name');
const email = document.querySelector('.form-email');
const body = document.querySelector('.form-body');
const sendBtn = document.querySelector('.btn-send-form');

async function sendContact() {
  const now = new Date();
  const dateOfSend = now.toUTCString();
  const payload = {
    date: dateOfSend,
    name: name.value,
    email: email.value,
    body: body.value
  }
  const send = await portfolioAPI.post('/subscribes', payload);
  $('#doneModal').modal("toggle");
  name.value = '';
  email.value = '';
  body.value = '';
}

sendBtn.addEventListener("click", async e => {
  e.preventDefault() ? e.preventDefault() : (e.returnValue = false);
  if (name.value && email.value && body.value) {
    sendContact()
  } else alert("Please fill out all the required fields!")
});

// Scroll animations using waypoint.js
new Waypoint({
  element: document.getElementsByClassName('experiences'),
  handler: function() {
    $('.exp__ul').addClass('animated fadeInDown');
    this.destroy()
  },
  offset: 'bottom-in-view'
})

new Waypoint({
  element: document.getElementsByClassName('projects'),
  handler: function() {
    $('.proj-img:nth-child(2n)').addClass('animated slideInDown');
    $('.proj-img:nth-child(2n-1)').addClass('animated slideInUp');
    this.destroy()
  },
  offset: 'bottom-in-view'
})

$('.contact').waypoint(function() {
  $('.contact-form__div').addClass('animated fadeInLeft');
  setTimeout(function () {
    $('.form__input:first-child').addClass('animated flash');
  }, 1300);
}, { 
  offset: "70%" 
});

// Tab control on Experiences Section 
const mainTab1 = document.querySelector(".hero-box01");
const mainTab2 = document.querySelector(".hero-box02");
const mainTab3 = document.querySelector(".hero-box03");

const openTab1 = document.querySelector(".exp-item__list:nth-child(1)");
const openTab2 = document.querySelector(".exp-item__list:nth-child(2)");
const openTab3 = document.querySelector(".exp-item__list:nth-child(3)");

const openTab4 = document.querySelector(".proj-item__list:nth-child(1)");
const openTab5 = document.querySelector(".proj-item__list:nth-child(2)");
const openTab6 = document.querySelector(".proj-item__list:nth-child(3)");

mainTab1.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "develop", project);
});
mainTab2.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "planning", project);
});
mainTab3.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "marketing", project);
});

openTab1.addEventListener("click", async e => {
  e.preventDefault();
  expAnime();
  openTab(event, "exp-item__list", "work", experience);
});
openTab2.addEventListener("click", async e => {
  e.preventDefault();
  expAnime();
  openTab(event, "exp-item__list", "educational", experience);
});
openTab3.addEventListener("click", async e => {
  e.preventDefault();
  expAnime();
  openTab(event, "exp-item__list", "participation", experience);
});

openTab4.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "develop", project);
});
openTab5.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "planning", project);
});
openTab6.addEventListener("click", async e => {
  e.preventDefault();
  openTab(event, "proj-item__list", "marketing", project);
});

const expAnime = function() {
  document.querySelector('.exp__ul').classList.remove("fadeInDown");
  setTimeout(() => {
    document.querySelector('.exp__ul').className += " fadeInDown";
  }, 10);
}

function openTab(event, elName, catName, funcion) {
  const tabLinks = document.querySelectorAll(`.${elName}`);
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  event.currentTarget.className += ' active';
  funcion(catName);
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
    } else {
      icon.addClass("fa-bars");
      icon.removeClass("fa-times");
      siteMenu.removeClass("js--main-nav")
      siteMenuList.removeClass("js--main-nav__li")
    }
  });
});

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