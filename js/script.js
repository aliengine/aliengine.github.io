function topMenu() {
    let menu = document.getElementById("menu");

    if (!menu.className) {
        menu.className += "responsive";
        setTimeout(function () {
            document.querySelector('#menu.responsive ul').style.left = -10 + 'px';
        }, 100)
    } else {
        document.querySelector('#menu.responsive ul').style.left = -1000 + 'px';
        setTimeout(function () { menu.className = "" }, 260);
    }
}

window.onload = function() {
    window.onscroll = function () {
        onScroll()
    };

    document.querySelector('#year').textContent = new Date().getFullYear();
}

const navbar = document.getElementById("header-wrapper");
let sticky = navbar.offsetTop + 1;

function onScroll() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}