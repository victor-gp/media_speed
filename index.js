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
    rate.textContent = Number(speed).toFixed(1);
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
    b_slower = ce('a'),
    b_faster = ce('a'),
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

b_slower.onclick = function(e){
    e.preventDefault();
    const slower = active.playbackRate - Number(range.step);
    const clamped = Math.max(Number(range.min), slower);
    const fixed = clamped.toFixed(1);
    update(fixed);
    range.value = fixed;
}

b_faster.onclick = function(e){
    e.preventDefault();
    const faster = active.playbackRate + Number(range.step);
    const clamped = Math.min(Number(range.max), faster);
    const fixed = clamped.toFixed(1);
    update(fixed);
    range.value = fixed;
}

buttons.appendChild(b_slower);
buttons.appendChild(b_half);
buttons.appendChild(b_one);
buttons.appendChild(b_one_and_half);
buttons.appendChild(b_two);
buttons.appendChild(b_faster);
buttons.style.display = 'flex';
buttons.style.justifyContent = 'space-between';
const tweakButton = (b, textContent) => {
    b.textContent = textContent
    b.href = '#'
    b.style.textDecoration = 'none';
    b.style.color = '#000088';
}
tweakButton(b_half, '.5x');
tweakButton(b_one, '1x');
tweakButton(b_one_and_half, '1.5x');
tweakButton(b_two, '2x');
tweakButton(b_slower, '<<');
tweakButton(b_faster, '>>');
range.type = 'range';
range.min = '.1';
range.max = '4';
range.step = '.1';
rate.style.display = 'inline-block';
rate.style.fontWeight = 'bold';
rate.style.border = 'dotted 2px';
rate.style.padding = '.5ex .5em'
rate.style.marginRight = '1em';
select.style.display = 'inline-block';
range.style.display = 'block';
container.style.position = 'fixed';
container.style.top = '1%';
container.style.right = '1%';
container.style.zIndex = '1000000';
container.style.background = '#ff4444';
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
container.appendChild(rate);
container.appendChild(select);
container.appendChild(range);
container.appendChild(buttons);
body.appendChild(cover);
body.appendChild(container);

for(var i = 0; i < media.length; i++){
    if(isPlaying(media[i])){
        setVideo(media[i]);
        select.querySelectorAll('option')[i + 1].selected = 'selected'
    }
}

document.addEventListener('keydown', (event) => {
    if (container.throttleSlowerFaster) return;
    if (event.key === '<') {
        setThrottling();
        b_slower.click();
    } else if (event.key === '>') {
        setThrottling();
        b_faster.click();
    }
});

function setThrottling() {
    container.throttleSlowerFaster = true;
    const unset = () => {
        if (container) container.throttleSlowerFaster = false;
    }
    setTimeout(unset, 300);
}

document.addEventListener('keyup', (event) => {
    if (!container) return;
    if (event.key === '<' || event.key === '>') {
        container.throttleSlowerFaster = false;
    }
});
