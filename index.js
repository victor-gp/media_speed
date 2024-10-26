var qs = document.querySelector.bind(document),
    qsa = document.querySelectorAll.bind(document);
existing = qsa('.video_speed_cover, .video_speed_container');

if(existing.length){
    existing.forEach(el => el.remove());
}

var isPlaying = function(media){
    return (!media.paused && !media.ended && media.readyState > 2);
}

var update = function(speed){
    if(!active){
        return;
    }

    active.playbackRate = speed;
    rate.textContent = speed;
};

var setVideo = function(v){
    active = v;
    update(v.playbackRate);
};

var ce = document.createElement.bind(document),
    media = qsa('video,audio'),
    active = null,
    body = qs('body'),
    container = ce('div'),
    select = ce('select'),
    options = [],
    range = ce('input'),
    rate = ce('span'),
    cover = ce('div'),
    b_half = ce('a'),
    b_one = ce('a'),
    b_one_and_half = ce('a'),
    b_two = ce('a'),
    b_beg = ce('a'),
    b_end = ce('a'),
    buttons = ce('div');

var choose = ce('option');
choose.text = 'choose media';
select.appendChild(choose);

for(var i = 0; i < media.length; i++){
    var o = ce('option');
    o.value = i;
    var l = media[i].nodeName == 'VIDEO' ? 'video' : 'audio'
    o.text = `${l}: ${i + 1}`;

    options.push(o);
    select.appendChild(o)
}

select.onchange = function(){
    var v = this.value;
    if(v){
        setVideo(media[v]);
    }
};

range.oninput = function(){
    update(range.value);
};

cover.onclick = function(){
    cover.remove();
    container.remove();
};

if(media.length){
    setVideo(media[0]);
    select.value = 0;
    range.value = media[0].playbackRate;
}

b_half.onclick = function(e){
    e.preventDefault();
    update(.5);
    range.value = .5;
}

b_one.onclick = function(e){
    e.preventDefault();
    update(1);
    range.value = 1;
}

b_one_and_half.onclick = function(e){
    e.preventDefault();
    update(1.5);
    range.value = 1.5;
}

b_two.onclick = function(e){
    e.preventDefault();
    update(2);
    range.value = 2;
}

b_beg.onclick = function(e){
    e.preventDefault();
    if(active){
        active.currentTime = 1;
    }
}

b_end.onclick = function(e){
    e.preventDefault();
    if(active){
        active.currentTime = active.duration - 1;
    }
}

buttons.appendChild(b_beg);
buttons.appendChild(b_half);
buttons.appendChild(b_one);
buttons.appendChild(b_one_and_half);
buttons.appendChild(b_two);
buttons.appendChild(b_end);
buttons.style.display = 'flex';
buttons.style.justifyContent = 'space-between';
b_half.textContent = '½x';
b_half.href = '#';
b_one.textContent = '1x';
b_one.href = '#';
b_one_and_half.textContent = '1½x';
b_one_and_half.href = '#';
b_two.textContent = '2x';
b_two.href = '#';
b_beg.textContent = '<<';
b_beg.href = '#';
b_end.textContent = '>>';
b_end.href = '#';
range.type = 'range';
range.min = '.1';
range.max = '4';
range.step = '.1';
select.style.display = 'inline-block';
range.style.display = 'block';
rate.style.display = 'inline-block';
container.style.position = 'fixed';
container.style.top = '1%';
container.style.right = '1%';
container.style.zIndex = '1000000';
container.style.background = 'red';
container.style.borderRadius = '6px';
container.style.padding = '10px';
container.style.textAlign = 'center';
container.classList.add('video_speed_container');
cover.style.position = 'fixed';
cover.style.top = 0;
cover.style.right = 0;
cover.style.bottom = 0;
cover.style.left = 0;
cover.classList.add('video_speed_cover');
container.appendChild(select);
container.appendChild(range);
container.appendChild(buttons);
container.appendChild(rate);
body.appendChild(cover);
body.appendChild(container);

for(var i = 0; i < media.length; i++){
    if(isPlaying(media[i])){
        setVideo(media[i]);
        select.querySelectorAll('option')[i + 1].selected = 'selected'
    }
}
