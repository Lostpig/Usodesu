let remote = window.remote = require('remote');
let models = require('../models/models');
require('./apiObserver');

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

let btnload = document.querySelector('#loadapi');
let shipinfo = models.getdata('shipinfo');
btnload.addEventListener('click', () => {
    let ship = shipinfo.get(1);
    let html;
    if(ship) {
        html = `id:${ship.id} and name is ${ship.name} , hp is ${ship.hp}`;
    }
    else {
        html = 'err: no ship';
    }

    document.querySelector('#apiinfo').innerHTML = html;
});
