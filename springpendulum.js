let G = 9.8;
let timeRate = 0.00004;
let timeRateMultiplier = 10;
let permaTrail = true;
const canvas = document.getElementById("canvas");
const canvas2 = document.getElementById("graph")

function rotate2D(x, y, theta)
{
    let newx = Math.cos(theta)*x - Math.sin(theta)*y;
    let newy = Math.sin(theta)*x + Math.cos(theta)*y;
    return [newx, newy];
}

const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ORIGIN = {
    x: 400,
    y: 400
}
const SCALE = 20;

const spring = {
    equilibriumLength: 7,
    length: 10 + 4*Math.random(),
    rDot: 2*Math.random(),
    k: 18
};

const bob = {
    mass: 3,
    theta: 0.2 + 0.5*Math.random(),
    thetaDot: 0.3 + 0.2*Math.random()
};

const trail = {
    coords: [[spring.length, bob.theta]],
    length: 80,
    color: "red",
    draw() {
        ctx2.beginPath();
        ctx2.moveTo(this.coords[0][0]*SCALE*Math.sin(this.coords[0][1]) + ORIGIN.x, this.coords[0][0]*SCALE*Math.cos(this.coords[0][1]) + ORIGIN.y);
        if(this.coords.length == 1)
        {
            ctx2.lineTo(this.coords[0][0]*SCALE*Math.sin(this.coords[0][1]) + ORIGIN.x + 0.1, this.coords[0][0]*SCALE*Math.cos(this.coords[0][1]) + ORIGIN.y + 0.1);
        }
        for(let i = 1; i < this.coords.length; i++)
        {
            ctx2.lineTo(this.coords[i][0]*SCALE*Math.sin(this.coords[i][1]) + ORIGIN.x, this.coords[i][0]*SCALE*Math.cos(this.coords[i][1]) + ORIGIN.y);
        }
        ctx2.strokeStyle = this.color;
        ctx2.stroke();
    },
    append(r, theta) {
        if(permaTrail || this.coords.length < this.length) {
            this.coords.push([r, theta]);
        }
        else {
            while(this.coords.length >= this.length)
            {
                this.coords.shift();
            }
            this.coords.push([r, theta]);
        }
    },
    reset() {
        let tempLength = this.coords.length;
        for(let i = 1; i < tempLength; i++)
        {
            this.coords.shift();
        }
        this.coords[0] = [spring.length, bob.theta];
    }
}

const system = {
    draw() {
        let x = Math.round(ORIGIN.x + spring.length*SCALE*Math.sin(bob.theta));
        let y = Math.round(ORIGIN.y + spring.length*SCALE*Math.cos(bob.theta));
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(Math.round(ORIGIN.x), Math.round(ORIGIN.y));
        for(let i = 1; i < 200; i++)
        {
            let tempx = 0;
            let tempy = 0;
            if(i % 20 < 5)
            {
                tempx = i/200*spring.length*SCALE;
                tempy = (i % 20)/10*SCALE;
            }
            else if (i % 20 < 15)
            {
                tempx = i/200*spring.length*SCALE;
                tempy = (0.5 - (i % 20 - 5)/10)*SCALE;
            }
            else{
                tempx = i/200*spring.length*SCALE;
                tempy = ((i % 20)/10 - 2)*SCALE;
            }
            let coord = rotate2D(tempx, tempy, -1*bob.theta+Math.PI/2);
            ctx.lineTo(Math.round(coord[0] + ORIGIN.x), coord[1] + Math.round(ORIGIN.y));
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
};

function thetaDiff(theta, r, thetaDot, rdot)
{
    return thetaDot;
}
function rDiff(theta, r, thetaDot, rdot)
{
    return rdot;
}
function thetaDotDiff(theta, r, thetaDot, rdot)
{
    return -1*G*Math.sin(theta)/r-2*rdot*thetaDot/r;
}
function rDotDiff(theta, r, thetaDot, rdot)
{
    return r*thetaDot*thetaDot - spring.k/bob.mass*(r-spring.equilibriumLength)+G*Math.cos(theta);
}

function rungeKutta2Var4thOrder(a, b, c, d, interval)
{
    let ka_1 = thetaDiff(a,b,c,d);
    let kb_1 = rDiff(a,b,c,d);
    let kc_1 = thetaDotDiff(a,b,c,d);
    let kd_1 = rDotDiff(a,b,c,d); 
    let ka_2 = thetaDiff(a + interval/2*ka_1, b + interval/2*kb_1, c + interval/2*kc_1, d + interval/2*kd_1);
    let kb_2 = rDiff(a + interval/2*ka_1, b + interval/2*kb_1, c + interval/2*kc_1, d + interval/2*kd_1);
    let kc_2 = thetaDotDiff(a + interval/2*ka_1, b + interval/2*kb_1, c + interval/2*kc_1, d + interval/2*kd_1);
    let kd_2 = rDotDiff(a + interval/2*ka_1, b + interval/2*kb_1, c + interval/2*kc_1, d + interval/2*kd_1);
    let ka_3 = thetaDiff(a + interval/2*ka_2, b + interval/2*kb_2, c + interval/2*kc_2, d + interval/2*kd_2);
    let kb_3 = rDiff(a + interval/2*ka_2, b + interval/2*kb_2, c + interval/2*kc_2, d + interval/2*kd_2);
    let kc_3 = thetaDotDiff(a + interval/2*ka_2, b + interval/2*kb_2, c + interval/2*kc_2, d + interval/2*kd_2);
    let kd_3 = rDotDiff(a + interval/2*ka_2, b + interval/2*kb_2, c + interval/2*kc_2, d + interval/2*kd_2);
    let ka_4 = thetaDiff(a + interval*ka_3, b + interval*kb_3, c + interval*kc_3, d + interval*kd_3);
    let kb_4 = rDiff(a + interval*ka_3, b + interval*kb_3, c + interval*kc_3, d + interval*kd_3);
    let kc_4 = thetaDotDiff(a + interval*ka_3, b + interval*kb_3, c + interval*kc_3, d + interval*kd_3);
    let kd_4 = rDotDiff(a + interval*ka_3, b + interval*kb_3, c + interval*kc_3, d + interval*kd_3);
    let newa = a + 1/6*interval*(ka_1 + 2*ka_2 + 2*ka_3 + ka_4);
    let newb = b + 1/6*interval*(kb_1 + 2*kb_2 + 2*kb_3 + kb_4);
    let newc = c + 1/6*interval*(kc_1 + 2*kc_2 + 2*kc_3 + kc_4);
    let newd = d + 1/6*interval*(kd_1 + 2*kd_2 + 2*kd_3 + kd_4);
    return [newa, newb, newc, newd];
}

function kineticEnergy() {
    return 1/2*(bob.mass)*(spring.length*bob.thetaDot)*(spring.length*bob.thetaDot) + 1/2*bob.mass*spring.rDot*spring.rDot;
}

function potentialEnergy() {
    return -1*bob.mass*G*Math.cos(bob.theta)*spring.length + 1/2*(spring.k)*(spring.equilibriumLength-spring.length)*(spring.equilibriumLength-spring.length);
}

function totalEnergy() {
    return kineticEnergy() + potentialEnergy();
}

function constructPotentialEnergyCurve(energy)
{
    let curve = [[0, 0]];
    let gapExists = false;
    for(let theta = 0; theta < 2*Math.PI; theta += 0.01)
    {
        let a = 1/2*spring.k;
        let b = -1*spring.k*spring.equilibriumLength - bob.mass*G*Math.cos(theta);
        let c = 1/2*spring.k*spring.equilibriumLength*spring.equilibriumLength - energy;
        let r1 = 0;
        let r2 = 0;
        if(b*b-4*a*c >= 0)
        {
            r1 = (-b - Math.sqrt(b*b-4*a*c))/2/a;
            r2 = (-b + Math.sqrt(b*b-4*a*c))/2/a;
        }
        else{
            gapExists = true;
        }
        if(r1 == 0 && r2 == 0)
        {
            continue;
        }
        if(curve.length == 1)
        {
            curve.push([r1, theta]);
            curve.push([r2, theta]);
            curve.shift();
        }
        else{
            curve.push([r1, theta]);
            curve.push([r2, theta]);
        }
    }
    if(!gapExists)
    {
        ctx2.beginPath();
        for(let i = 0; i < curve.length; i += 2)
        {
            let x = curve[i][0]*Math.sin(curve[i][1]);
            let y = curve[i][0]*Math.cos(curve[i][1]);
            if(i == 0)
            {
                ctx2.moveTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
            else{
                ctx2.lineTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
        }
        ctx2.strokeStyle = "blue";
        ctx2.stroke();
        ctx2.beginPath();
        for(let i = 1; i < curve.length; i += 2)
        {
            let x = curve[i][0]*Math.sin(curve[i][1]);
            let y = curve[i][0]*Math.cos(curve[i][1]);
            if(i == 1)
            {
                ctx2.moveTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
            else{
                ctx2.lineTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
        }
        ctx2.strokeStyle = "blue";
        ctx2.stroke();
    }
    else{
        ctx2.beginPath();
        for(let i = 0; i < curve.length; i += 2)
        {
            let x = curve[i][0]*Math.sin(curve[i][1]);
            let y = curve[i][0]*Math.cos(curve[i][1]);
            if(i == 0)
            {
                ctx2.moveTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
            else{
                ctx2.lineTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
        }
        ctx2.strokeStyle = "blue";
        ctx2.stroke();
        ctx2.beginPath();
        for(let i = 1; i < curve.length; i += 2)
        {
            let x = curve[i][0]*Math.sin(curve[i][1]);
            let y = curve[i][0]*Math.cos(curve[i][1]);
            if(i == 1)
            {
                ctx2.moveTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
            else{
                ctx2.lineTo(x*SCALE + ORIGIN.x, y*SCALE + ORIGIN.y);
            }
        }
        ctx2.strokeStyle = "blue";
        ctx2.stroke();
    }
}

function drawPendulum()
{   
    ctx.clearRect(0, 0, 800, 800);
    ctx2.clearRect(0, 0, 800, 800);
    system.draw();
    trail.draw();
    constructPotentialEnergyCurve(totalEnergy());
    document.getElementById("test").innerHTML = "what";
    //update
    for(let i = 0; i < 1000; i++)
    {
        let newVals = rungeKutta2Var4thOrder(bob.theta, spring.length, bob.thetaDot, spring.rDot, timeRate*timeRateMultiplier);
        bob.theta = newVals[0];
        spring.length = newVals[1];
        bob.thetaDot = newVals[2];
        spring.rDot = newVals[3];

    }
    trail.append(spring.length, bob.theta);
    let PE = potentialEnergy();
    let KE = kineticEnergy();
    let E = PE + KE;

    document.getElementById("test").innerHTML = " " + Math.round(PE*1000)/1000 + " " + Math.round(KE*1000)/1000 + " " + Math.round(E*1000)/1000 +  
    " " + Math.round(bob.theta*1000)/1000 + " " + Math.round(spring.length*1000)/1000 + " " + Math.round(spring.rDot*1000)/1000 + " " + Math.round(bob.thetaDot*1000)/1000;
    //wait timeRate
    window.requestAnimationFrame(drawPendulum);
    
};

window.requestAnimationFrame(drawPendulum);