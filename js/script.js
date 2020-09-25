function topMenu() {
    let menu = document.getElementById("menu");

    if (!menu.className) {
        menu.className += "responsive";
        setTimeout(function () {
            document.querySelector('#menu.responsive ul').style.left = 0;
        }, 100)
    } else {
        document.querySelector('#menu.responsive ul').style.left = -1000 + 'px';
        setTimeout(function () { menu.className = "" }, 260);
    }
}