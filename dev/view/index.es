let remote = require('remote');

let wvKan   = document.getElementById('wvkan'),
    content = document.getElementById('content');

let link = document.createElement('button');
link.innerHTML = 'open own tool';
link.addEventListener('click', () => {
    remote.getCurrentWindow().openDevTools({detach: true});
});
content.appendChild(link);
let link2 = document.createElement('button');
link2.innerHTML = 'open page tool';
link2.addEventListener('click', () => {
    wvKan.openDevTools({detach: true});
});
content.appendChild(link2);

let btngo = document.getElementById('btngo');
btngo.addEventListener('click', () => {
    let u = document.getElementById('urltext').value;
    wvKan.src = u;
});
