const NC = 16
const NS ="http://www.w3.org/2000/svg"

// x1, y1, x2, y2
const PATHS = [
    
    [0,0,0,2],
    [0,2,0,4],
    
    [0,4,1,4],
    [1,4,2,4],
    
    [2,4,2,2],
    [2,2,2,0],
    
    [2,0,1,0],
    [1,0,0,0],

    [0,2,1,2],
    [1,2,2,2],

    [0,0,1,2],
    [1,2,2,4],
    [0,4,1,2],
    [1,2,2,0],

    [1,0,1,2],
    [1,2,1,4],

    [0,2,1,0],
    [2,2,1,0],
    [0,2,1,4],
    [2,2,1,4],

]
const SIZE = PATHS.length
const BASE = '0' * SIZE
const CUT = 0.25

const timeDelta = 1000;

let data = new Array(SIZE).fill(false)
let containers = new Array(NC).fill(false)
let timers = new Array(NC)

function generateBool(){
    //console.log('bool')
    let n = ((Math.random()) < CUT)?true:false;
    //console.log(n)
    return n
}

function generate(l=SIZE) {
    //console.log('generate')
    let _data = new Array(SIZE).fill(false)
    for (let i=0; i<l; i++) {
        _data[i] = generateBool()
    }
    return _data
}

function generateSVG() {
    let svg = document.createElementNS(NS, 'svg')
    let mult = 100
    let sw = 10
    svg.setAttribute('width', 2*mult)
    svg.setAttribute('height', 4*mult)
    svg.setAttribute('viewBox', `${-sw} ${-sw} ${2*sw+2*mult} ${2*sw+4*mult}`)
    let s = '';
    for (let i=0; i<SIZE; i++) {
        let _id = 'l' + i;
        let _s = `<line id='${'l'+i}' x1='${PATHS[i][0]*mult}' y1='${PATHS[i][1]*mult}' x2='${PATHS[i][2]*mult}' y2='${PATHS[i][3]*mult}' stroke='black' stroke-width='${sw}' stroke-linecap='round' opacity='1'/>`
        s += _s;
    }
    svg.innerHTML = s
    return svg
}

function init() {
    let c = document.getElementById('container');
    for (let i=0; i<NC; i++){
        child = generateSVG();
        child.setAttribute('id', 'c'+i)
        c.appendChild(child);
    }
}

function updateAll(){
    //console.log(state)
    t = Date.now()
    for (let j=0; j<NC; j++){
        let _container = document.getElementById('c'+j);
        for (let i=0; i<SIZE; i++) {
            let element = _container.getElementById('l'+i)
            data = generate();
            //element.setAttribute('stroke', (data[i]===true)?'black':'white')
            element.setAttribute('opacity', (data[i]===true)?'1':'0')
        }
    }
    return Date.now() - t
}

function _update(container){
    try {
        container = parseInt(container)
        let _container = document.getElementById('c'+container);
        for (let i=0; i<SIZE; i++) {
            let element = _container.getElementById('l'+i)
            let _data = generate();
            //element.setAttribute('stroke', (data[i]===true)?'black':'white')
            element.setAttribute('opacity', (_data[i]===true)?'1':'0')
        }
        /*let t = Math.random()*timeDelta*4 + timeDelta
        timers[container] = setTimeout( ()=> {requestAnimationFrame(update(container))}, t)*/
    } catch {}
}

function updateSerial(){
    for (let i=0; i<NC; i++) {
        //clearTimeout(timers[i])
        timers[i] = setTimeout( ()=> {requestAnimationFrame(() =>_update(i))}, i*100)
    }
    let t = Math.random()*timeDelta*4 ;
    setTimeout( ()=> {updateSerial()}, t)
}

function show(){
    let updateDelta = update();
    setTimeout( ()=> {requestAnimationFrame(show)}, timeDelta)
}



window.onload = () => {
    init();
    //show();
    /*for (let i = 0; i<NC; i++) {
        update(i);
    }*/
    updateSerial()
}