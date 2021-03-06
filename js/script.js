const translator = document.querySelector(".second .translator");
const input = document.querySelector(".input");
const lisFrom = document.querySelectorAll(".first .choose li.firstUl");
const lisTo = document.querySelectorAll(".second .choose li");
const btn = document.querySelector(".btn");
const langs = document.querySelector(".langs");
const more1st = document.querySelector(".more");
const more2nd = document.querySelector(".second .more");
const moreLangs = document.querySelectorAll(".container .langs ul li");
let translation = "";
let fromLang = "pl";
let toLang = "en";
let lang;
const key = `trnsl.1.1.20190707T201153Z.e127b502ca8c8497.8d4de021cacefbe69e6f3ecf754746c2f092c15d`;
const tablet = window.matchMedia("(min-width:768px)");

input.addEventListener("click", () => {
  input.value = "";
  translator.textContent = "";
});

lisFrom.forEach(li => {
  li.addEventListener("click", () => {
    if (more1st.classList.contains("active")) {
      langs.classList.remove("activeLangs");
    }
    more1st.addEventListener("click", moreFun);
    more1st.classList.remove("active");
    lisFrom.forEach(li => li.classList.remove("active"));
    li.classList.add("active");
    fromLang = li.dataset.lang;
  });
});

const moreFun = (e, more, lis, langs) => {
  lis.forEach(li => li.classList.remove("active"));
  e.target.parentNode.classList.add("active");
  langs.classList.add("activeLangs");
  more.removeEventListener("click", moreFun, false);
};

more1st.addEventListener("click", e => moreFun(e, more1st, lisFrom, langs));

lisTo.forEach(li => {
  li.addEventListener("click", () => {
    if (more2nd.classList.contains("active")) {
      langs.classList.remove("activeLangs");
    }
    lisTo.forEach(li => li.classList.remove("active"));
    li.classList.add("active");
    toLang = li.dataset.lang;
  });
});

more2nd.addEventListener("click", e => moreFun(e, more2nd, lisTo, langs));

btn.addEventListener("click", e => {
  e.preventDefault();
  if (input.value.length !== 0) {
    if (fromLang === "detect") {
      detect(input.value);
    } else {
      translate(input.value);
    }
  }
});

input.addEventListener("keydown", e => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    if (input.value.length !== 0) {
      if (fromLang === "detect") {
        detect(input.value);
      } else {
        translate(input.value);
      }
    }
  }
});

fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=${key}`)
  .then(response => {
    if (response.ok) return response;
  })
  .then(response => {
    return response.json();
  })
  .then(data => {
    fillMore(data.langs);
    window.addEventListener("resize", () => {
      fillMore(data.langs);
    });
  });

const fillMore = data => {
  const ordered = {};
  const obj = {};
  let counter = 0;
  moreUl1 = document.createElement("ul");
  moreUl2 = document.createElement("ul");
  moreUl3 = document.createElement("ul");
  moreUl4 = document.createElement("ul");
  for (let [key, value] of Object.entries(data)) {
    obj[value] = key;
  }
  Object.keys(obj)
    .sort()
    .forEach(key => {
      ordered[key] = obj[key];
    });
  if (!tablet.matches) {
    langs.textContent = "";
    icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-times");
    langs.appendChild(icon);
    quitLangs(icon);
    moreUl1.textContent = "";
    moreUl2.textContent = "";
    moreUl3.textContent = "";
    moreUl4.textContent = "";
    counter = 0;
    langs.appendChild(moreUl1);
    langs.appendChild(moreUl2);
    langs.appendChild(moreUl3);
    for (let [key, value] of Object.entries(ordered)) {
      counter++;
      newLi = document.createElement("li");
      newLi.textContent = key;
      newLi.dataset.lang = value;
      if (counter <= 31) {
        moreUl1.appendChild(newLi);
      } else if (counter > 31 && counter <= 62) {
        moreUl2.appendChild(newLi);
      } else {
        moreUl3.appendChild(newLi);
      }
    }
  } else {
    langs.textContent = "";
    icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-times");
    langs.appendChild(icon);
    quitLangs(icon);
    moreUl1.textContent = "";
    moreUl2.textContent = "";
    moreUl3.textContent = "";
    moreUl4.textContent = "";
    counter = 0;
    langs.appendChild(moreUl1);
    langs.appendChild(moreUl2);
    langs.appendChild(moreUl3);
    langs.appendChild(moreUl4);
    for (let [key, value] of Object.entries(ordered)) {
      counter++;
      newLi = document.createElement("li");
      newLi.textContent = key;
      newLi.dataset.lang = value;
      if (counter <= 23) {
        moreUl1.appendChild(newLi);
      } else if (counter > 23 && counter <= 46) {
        moreUl2.appendChild(newLi);
      } else if (counter > 46 && counter <= 69) {
        moreUl3.appendChild(newLi);
      } else {
        moreUl4.appendChild(newLi);
      }
    }
  }
  let newLis = document.querySelectorAll(".langs ul li");
  newLis.forEach(newLi => {
    newLi.addEventListener("click", e => {
      newLis.forEach(newLi => newLi.classList.remove("active"));
      newLi.classList.add("active");
      if (more1st.classList.contains("active")) {
        lisFrom[1].textContent = e.target.textContent;
        lisFrom[1].dataset.lang = e.target.dataset.lang;
        lisFrom[1].classList.add("active");
        more1st.classList.remove("active");
        fromLang = e.target.dataset.lang;
      } else if (more2nd.classList.contains("active")) {
        lisTo[0].textContent = e.target.textContent;
        lisTo[0].dataset.lang = e.target.dataset.lang;
        lisTo[0].classList.add("active");
        more2nd.classList.remove("active");
        toLang = e.target.dataset.lang;
      }
      langs.classList.remove("activeLangs");
    });
  });
};

const translate = text => {
  fetch(
    `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${text}&lang=${fromLang}-${toLang}&[format=plain]`
  )
    .then(response => {
      if (response.ok) return response;
      else return;
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      translator.textContent = data.text[0];
    });
};

const detect = text => {
  fetch(
    `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${key}&text=${text}`
  )
    .then(response => {
      if (response.ok) return response;
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      getLang(data.lang);
    });
};

const getLang = lang => {
  fetch(
    `https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key=${key}`
  )
    .then(response => {
      if (response.ok) return response;
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      li = document.querySelectorAll("li.firstUl");
      li.forEach(li => li.classList.remove("active"));
      lisFrom[1].textContent = data.langs[lang];
      lisFrom[1].dataset.lang = lang;
      lisFrom[1].classList.add("active");
      fromLang = lang;
      translate(input.value);
    });
};

const quitLangs = quit => {
  quit.addEventListener("click", () => {
    langs.classList.remove("activeLangs");
    if (more1st.classList.contains("active")) {
      more1st.classList.remove("active");
      lisFrom[1].classList.add("active");
      fromLang = lisFrom[1].dataset.lang;
    } else {
      more2nd.classList.remove("active");
      lisTo[1].classList.add("active");
      toLang = lisTo[1].dataset.lang;
    }
  });
};
