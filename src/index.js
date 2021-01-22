import { fabric } from "fabric";
import HouseWinter from "./assets/house_winter.svg";
import './index.css';

function component() {
    const element = document.createElement('canvas');

    element.innerHTML = 'We have canvas.';
    element.id = "canvas";
    element.width = window.innerWidth;
    element.height = window.innerHeight;

    return element;
}


let fabcanvas;
function init() {
    fabcanvas = new fabric.StaticCanvas('canvas', {
        renderOnAddRemove: false
    });
    fabcanvas.setBackgroundColor('#e2e2e2');

    init_house(0.5);
    init_house(0.3);
    init_yuki();
    fabcanvas.renderAll();
}

// =========================== 物体群 ===========================

const snows = [];
const SNOW_COUNT_MAX = 150;  // 粒
const snowColors = ['#f8f8ff', '#f9fafb', '#fffaff', '#fbfbf9', '#fafafa'];
function init_yuki() {
    // 降雪を表現
    // とりあえずcircleで表現
    const canvasW = fabcanvas.getWidth();
    const canvasH = fabcanvas.getHeight();
    for (let i = 0; i < SNOW_COUNT_MAX; i++) {
        const snow = new fabric.Circle({
            radius: 10 * Math.random() + 3,
            fill: snowColors[Math.floor(snowColors.length * Math.random())],
            left: canvasW * Math.random(),
            top: canvasH * Math.random(),
        });
        snow.velY = 15 * Math.random() + 10;
        fabcanvas.add(snow);
        snows.push(snow);
    }
}

const roofColors = ['#ffe1e1', '#ff9595', '#ffca95', '#ca95ff'];
function init_house(scaling) {
    // 家を表現
    const canvasH = fabcanvas.getHeight();
    const canvasW = fabcanvas.getWidth();
    fabric.loadSVGFromURL(HouseWinter, (oImg) => {
        const house = new fabric.Group(oImg);
        house.set({ scaleX: scaling, scaleY: scaling });
        house.set({
            top: canvasH - house.height * scaling,
            left: (canvasW - house.width * scaling) * Math.random()
        });
        house.item(3).set({ 'stroke': roofColors[Math.floor(roofColors.length * Math.random())] });
        fabcanvas.insertAt(house, 0);
        console.log("group:", house);
        console.log('oImg', oImg);
    });

}

// ======================= 物体群ここまで =======================


const canvas = component();
document.body.appendChild(canvas);
window.addEventListener('resize', () => {
    fabcanvas.setWidth(window.innerWidth);
    fabcanvas.setHeight(window.innerHeight);
});


init();
let timestamp = 0;
const reqAnimFrame = () => {
    // 動く物体の更新はここで行う。
    fabric.util.requestAnimFrame((time) => {
        console.log(time);
        const timedelta = time - timestamp;  // ms
        timestamp = time;

        const canvasH = fabcanvas.getHeight();
        const canvasW = fabcanvas.getWidth();
        for (let snow of snows) {
            let newy = snow.get('top') + snow.velY * timedelta / 1000;
            if (newy > canvasH + 20) {
                newy = -20;
                snow.set('left', canvasW * Math.random());
            }
            snow.set('top', newy);
        }
        fabcanvas.renderAll();
        reqAnimFrame();
    }, fabcanvas);
};
reqAnimFrame();