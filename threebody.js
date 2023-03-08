const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const G = 400;
const REPULSION = 0.1;
const TIMERATE = 0.01;
const RADIUS = 0.8;
const ORIGIN = {
    x: 400,
    y: 400
}
const SCALE = 20;
const NORMALIZATION = Math.sqrt(40);
const body1 = {
    mass: 1,
    x: 9.7000436,
    y: -2.4308753,
    vx: 0.93240737/2*NORMALIZATION,
    vy: 0.86473146/2*NORMALIZATION,
    radius: RADIUS,
    color: "red",
    draw() {
        ctx.beginPath();
        ctx.arc(this.x*SCALE + ORIGIN.x, this.y*SCALE + ORIGIN.y, this.radius*SCALE, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}; 

const body2 = {
    mass: 1,
    x: -9.7000436,
    y: 2.4308753,
    vx: 0.93240737/2*NORMALIZATION,
    vy: 0.86473146/2*NORMALIZATION,
    radius: RADIUS,
    color: "blue",
    draw() {
        ctx.beginPath();
        ctx.arc(this.x*SCALE + ORIGIN.x, this.y*SCALE + ORIGIN.y, this.radius*SCALE, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

const body3 = {
    mass: 1,
    x: 0,
    y: 0,
    vx: -0.93240737*NORMALIZATION,
    vy: -0.86473146*NORMALIZATION,
    radius: RADIUS,
    color: "green",
    draw() {
        ctx.beginPath();
        ctx.arc(this.x*SCALE + ORIGIN.x, this.y*SCALE + ORIGIN.y, this.radius*SCALE, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

const trail1 = {
    coords: [[9.7000436, -2.4308753]],
    length: 80,
    color: "red",
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.coords[0][0]*SCALE + ORIGIN.x, this.coords[0][1]*SCALE + ORIGIN.y);
        if(this.coords.length == 1)
        {
            ctx.lineTo(this.coords[0][0]*SCALE + ORIGIN.x + 0.1, this.coords[0][1]*SCALE + ORIGIN.y + 0.1);
        }
        for(let i = 1; i < this.coords.length; i++)
        {
            ctx.lineTo(this.coords[i][0]*SCALE + ORIGIN.x, this.coords[i][1]*SCALE + ORIGIN.y);
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    },
    append(x, y) {
        if(this.coords.length < this.length) {
            this.coords.push([x, y]);
        }
        else {
            this.coords.shift();
            this.coords.push([x, y]);
        }
    }
}

const trail2 = {
    coords: [[-9.7000436, 2.4308753]],
    length: 80,
    color: "blue",
    draw() {
        ctx.beginPath()
        ctx.moveTo(this.coords[0][0]*SCALE + ORIGIN.x, this.coords[0][1]*SCALE + ORIGIN.y)
        if(this.coords.length == 1)
        {
            ctx.lineTo(this.coords[0][0]*SCALE + ORIGIN.x + 0.1, this.coords[0][1]*SCALE + ORIGIN.y + 0.1);
        }
        for(let i = 1; i < this.coords.length; i++)
        {
            ctx.lineTo(this.coords[i][0]*SCALE + ORIGIN.x, this.coords[i][1]*SCALE + ORIGIN.y);
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    },
    append(x, y) {
        if(this.coords.length < this.length) {
            this.coords.push([x, y]);
        }
        else {
            this.coords.shift();
            this.coords.push([x, y]);
        }
    }
}

const trail3 = {
    coords: [[0, 0]],
    length: 80,
    color: "green",
    draw() {
        ctx.beginPath()
        ctx.moveTo(this.coords[0][0]*SCALE + ORIGIN.x, this.coords[0][1]*SCALE + ORIGIN.y)
        if(this.coords.length == 1)
        {
            ctx.lineTo(this.coords[0][0]*SCALE + ORIGIN.x + 0.1, this.coords[0][1]*SCALE + ORIGIN.y + 0.1);
        }
        for(let i = 1; i < this.coords.length; i++)
        {
            ctx.lineTo(this.coords[i][0]*SCALE + ORIGIN.x, this.coords[i][1]*SCALE + ORIGIN.y);
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    },
    append(x, y) {
        if(this.coords.length < this.length) {
            this.coords.push([x, y]);
        }
        else {
            this.coords.shift();
            this.coords.push([x, y]);
        }
    }
}



function distance12()
{
    return Math.pow(Math.pow((body1.x-body2.x), 2) + Math.pow((body1.y-body2.y), 2), 0.5);
}
function distance13()
{
    return Math.pow(Math.pow((body1.x-body3.x), 2) + Math.pow((body1.y-body3.y), 2), 0.5);
}
function distance23()
{
    return Math.pow(Math.pow((body2.x-body3.x), 2) + Math.pow((body2.y-body3.y), 2), 0.5);
}
function distance(x1, x2, y1, y2)
{
    return Math.pow(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2), 0.5);
}

function rotate2D(x, y, theta)
{
    let newx = Math.cos(theta)*x - Math.sin(theta)*y;
    let newy = Math.sin(theta)*x + Math.cos(theta)*y;
    return [newx, newy];
}


function x1DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body2.mass*(x2-x1)/Math.pow(distance(x1, x2, y1, y2), 3) + G*body3.mass*(x3-x1)/Math.pow(distance(x1, x3, y1, y3), 3);
        //+ G*body2.mass*(x1-x2)/Math.pow(distance(x1, x2, y1, y2), 7) + G*body3.mass*(x1-x3)/Math.pow(distance(x1, x3, y1, y3), 7);
}
function x2DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body1.mass*(x1-x2)/Math.pow(distance(x1, x2, y1, y2), 3) + G*body3.mass*(x3-x2)/Math.pow(distance(x2, x3, y2, y3), 3);
        //+ G*body1.mass*(x2-x1)/Math.pow(distance(x1, x2, y1, y2), 7) + G*body3.mass*(x2-x3)/Math.pow(distance(x2, x3, y2, y3), 7);
}
function x3DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body2.mass*(x2-x3)/Math.pow(distance(x2, x3, y2, y3), 3) + G*body1.mass*(x1-x3)/Math.pow(distance(x1, x3, y1, y3), 3);
        //+ G*body2.mass*(x3-x2)/Math.pow(distance(x2, x3, y2, y3), 7) + G*body1.mass*(x3-x1)/Math.pow(distance(x1, x3, y1, y3), 7);
}
function y1DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body2.mass*(y2-y1)/Math.pow(distance(x1, x2, y1, y2), 3) + G*body3.mass*(y3-y1)/Math.pow(distance(x1, x3, y1, y3), 3);
        //+ G*body2.mass*(y1-y2)/Math.pow(distance(x1, x2, y1, y2), 7) + G*body3.mass*(y1-y3)/Math.pow(distance(x1, x3, y1, y3), 7);
}
function y2DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body1.mass*(y1-y2)/Math.pow(distance(x1, x2, y1, y2), 3) + G*body3.mass*(y3-y2)/Math.pow(distance(x2, x3, y2, y3), 3);
        //+ G*body1.mass*(y2-y1)/Math.pow(distance(x1, x2, y1, y2), 7) + G*body3.mass*(y2-y3)/Math.pow(distance(x2, x3, y2, y3), 7);
}
function y3DotDiff(x1, x2, x3, y1, y2, y3)
{
    return G*body2.mass*(y2-y3)/Math.pow(distance(x2, x3, y2, y3), 3) + G*body1.mass*(y1-y3)/Math.pow(distance(x1, x3, y1, y3), 3)
        //+ G*body2.mass*(y3-y2)/Math.pow(distance(x2, x3, y2, y3), 7) + G*body1.mass*(y3-y1)/Math.pow(distance(x1, x3, y1, y3), 7);
}



// x1 = 0, x2 = 1, x3 = 2, y1 = 3, y2 = 4, y3 = 5, x1dot = 6, x2dot = 7, x3dot = 8, y1dot = 9, y2dot = 10, y3dot = 11
function rungeKutta2Var2ndOrder(nums, interval)
{
    let kx1_1 = nums[6];
    let kx2_1 = nums[7];
    let kx3_1 = nums[8];
    let ky1_1 = nums[9];
    let ky2_1 = nums[10];
    let ky3_1 = nums[11];
    let kx1dot_1 = x1DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let kx2dot_1 = x2DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let kx3dot_1 = x3DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let ky1dot_1 = y1DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let ky2dot_1 = y2DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let ky3dot_1 = y3DotDiff(nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]);
    let kx1_2 = nums[6] + interval/2*kx1dot_1;
    let kx2_2 = nums[7] + interval/2*kx2dot_1;
    let kx3_2 = nums[8] + interval/2*kx3dot_1;
    let ky1_2 = nums[9] + interval/2*ky1dot_1;
    let ky2_2 = nums[10] + interval/2*ky2dot_1;
    let ky3_2 = nums[11] + interval/2*ky3dot_1;
    let kx1dot_2 = x1DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let kx2dot_2 = x2DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let kx3dot_2 = x3DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let ky1dot_2 = y1DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let ky2dot_2 = y2DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let ky3dot_2 = y3DotDiff(nums[0] + interval/2*kx1_1, nums[1] + interval/2*kx2_1, nums[2] + interval/2*kx3_1, nums[3] + interval/2*ky1_1, nums[4] + interval/2*ky2_1, nums[5] + interval/2*ky3_1);
    let kx1_3 = nums[6] + interval/2*kx1dot_2;
    let kx2_3 = nums[7] + interval/2*kx2dot_2;
    let kx3_3 = nums[8] + interval/2*kx3dot_2;
    let ky1_3 = nums[9] + interval/2*ky1dot_2;
    let ky2_3 = nums[10] + interval/2*ky2dot_2;
    let ky3_3 = nums[11] + interval/2*ky3dot_2;
    let kx1dot_3 = x1DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let kx2dot_3 = x2DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let kx3dot_3 = x3DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let ky1dot_3 = y1DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let ky2dot_3 = y2DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let ky3dot_3 = y3DotDiff(nums[0] + interval/2*kx1_2, nums[1] + interval/2*kx2_2, nums[2] + interval/2*kx3_2, nums[3] + interval/2*ky1_2, nums[4] + interval/2*ky2_2, nums[5] + interval/2*ky3_2);
    let kx1_4 = nums[6] + interval*kx1dot_3;
    let kx2_4 = nums[7] + interval*kx2dot_3;
    let kx3_4 = nums[8] + interval*kx3dot_3;
    let ky1_4 = nums[9] + interval*ky1dot_3;
    let ky2_4 = nums[10] + interval*ky2dot_3;
    let ky3_4 = nums[11] + interval*ky3dot_3;
    let kx1dot_4 = x1DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let kx2dot_4 = x2DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let kx3dot_4 = x3DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let ky1dot_4 = y1DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let ky2dot_4 = y2DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let ky3dot_4 = y3DotDiff(nums[0] + interval*kx1_3, nums[1] + interval*kx2_3, nums[2] + interval*kx3_3, nums[3] + interval*ky1_3, nums[4] + interval*ky2_3, nums[5] + interval*ky3_3);
    let newx1 = nums[0] + 1/6*interval*(kx1_1 + 2*kx1_2 + 2*kx1_3 + kx1_4);
    let newx2 = nums[1] + 1/6*interval*(kx2_1 + 2*kx2_2 + 2*kx2_3 + kx2_4);
    let newx3 = nums[2] + 1/6*interval*(kx3_1 + 2*kx3_2 + 2*kx3_3 + kx3_4);
    let newy1 = nums[3] + 1/6*interval*(ky1_1 + 2*ky1_2 + 2*ky1_3 + ky1_4);
    let newy2 = nums[4] + 1/6*interval*(ky2_1 + 2*ky2_2 + 2*ky2_3 + ky2_4);
    let newy3 = nums[5] + 1/6*interval*(ky3_1 + 2*ky3_2 + 2*ky3_3 + ky3_4);
    let newx1dot = nums[6] + 1/6*interval*(kx1dot_1 + 2*kx1dot_2 + 2*kx1dot_3 + kx1dot_4);
    let newx2dot = nums[7] + 1/6*interval*(kx2dot_1 + 2*kx2dot_2 + 2*kx2dot_3 + kx2dot_4);
    let newx3dot = nums[8] + 1/6*interval*(kx3dot_1 + 2*kx3dot_2 + 2*kx3dot_3 + kx3dot_4);
    let newy1dot = nums[9] + 1/6*interval*(ky1dot_1 + 2*ky1dot_2 + 2*ky1dot_3 + ky1dot_4);
    let newy2dot = nums[10] + 1/6*interval*(ky2dot_1 + 2*ky2dot_2 + 2*ky2dot_3 + ky2dot_4);
    let newy3dot = nums[11] + 1/6*interval*(ky3dot_1 + 2*ky3dot_2 + 2*ky3dot_3 + ky3dot_4);
    return [newx1, newx2, newx3, newy1, newy2, newy3, newx1dot, newx2dot, newx3dot, newy1dot, newy2dot, newy3dot];
}

function kineticEnergy() {
    return 1/2*body1.mass*(body1.vx*body1.vx + body1.vy*body1.vy) + 1/2*body2.mass*(body2.vx*body2.vx + body2.vy*body2.vy) + 1/2*body3.mass*(body3.vx*body3.vx + body3.vy*body3.vy);
}

function potentialEnergy() {
    return -1*G*body1.mass*body2.mass/distance12() - G*body1.mass*body3.mass/distance13() - G*body2.mass*body3.mass/distance23();
}

function totalEnergy() {
    return kineticEnergy() + potentialEnergy();
}

function collisionResolution(x1, x2, y1, y2, vx1, vx2, vy1, vy2, m1, m2) {

    // Resolve positions
    let centerx = (x1 + x2)/2;
    let centery = (y1 + y2)/2;
    let collScale = (2*RADIUS)/distance(x1, x2, y1, y2);
    let newx1 = centerx + collScale*(x1-centerx);
    let newy1 = centery + collScale*(y1-centery);
    let newx2 = centerx + collScale*(x2-centerx);
    let newy2 = centery + collScale*(y2-centery);
    // Resolve velocities
    // Use the positions to rotate all components so that its horizontal
    let th = 0;
    if((x2-x1) != 0)
    {
        th = Math.atan((y2-y1)/(x2-x1));
    }
    else{
        if(y2-y1 > 0)
        {
            th = Math.PI/2;
        }
        else
        {
            th = -1*Math.PI/2
        }
    }
    if(th < 0 && (y2-y1) > 0)
    {
        th += Math.PI;
    }
    else if(th > 0 && (y2-y1) < 0)
    {
        th += Math.PI;
    }
    let newv1 = rotate2D(vx1, vy1, -1*th);
    let newv2 = rotate2D(vx2, vy2, -1*th);
    // Negate the new vx's
    let ux1 = newv1[0];
    let ux2 = newv2[0];
    newv1[0] = (m1-m2)/(m1+m2)*ux1 + 2*m2/(m1+m2)*ux2;
    newv2[0] = 2*m1/(m1+m2)*ux1 + (m2-m1)/(m1+m2)*ux2;
    newv1[0] *= Math.pow((2*RADIUS - Math.abs(ux1*TIMERATE) - Math.abs(ux2*TIMERATE))/(2.05*RADIUS), 0.5);
    newv2[0] *= Math.pow((2*RADIUS - Math.abs(ux1*TIMERATE) - Math.abs(ux2*TIMERATE))/(2.05*RADIUS), 0.5);
    // Retain the new vy's
    // Rotate back
    let finalv1 = rotate2D(newv1[0], newv1[1], th);
    let finalv2 = rotate2D(newv2[0], newv2[1], th);
    let newvx1 = 0.999*finalv1[0];
    let newvx2 = 0.999*finalv2[0];
    let newvy1 = 0.999*finalv1[1];
    let newvy2 = 0.999*finalv2[1];
    return [newx1, newx2, newy1, newy2, newvx1, newvx2, newvy1, newvy2];
}

function COM() {
    let M = body1.mass + body2.mass + body3.mass;
    let COMx = (body1.mass*body1.x + body2.mass*body2.x + body3.mass*body3.x)/M;
    let COMy = (body1.mass*body1.y + body2.mass*body2.y + body3.mass*body3.y)/M;
    return [COMx, COMy];
}


function drawBodies()
{
    //plot code
    /*
    Central Position = 800, 800
    Bob1 = 800 + lsin(theta1), 800 + lcos(theta1)
    Bob2 = Bob1 + l2sin(theta2), Bob2 + l2cos(theta2)
    Plot rectangle between central and bob1, another between bob1 and bob2
    */
    ctx.clearRect(0, 0, 800, 800);
    trail1.draw();
    trail2.draw();
    trail3.draw();
    body1.draw();
    body2.draw();
    body3.draw();
    for(let i = 0; i < 3; i++)
    {
        //update
        let currVals = [body1.x, body2.x, body3.x, body1.y, body2.y, body3.y, body1.vx, body2.vx, body3.vx, body1.vy, body2.vy, body3.vy];
        let newVals = rungeKutta2Var2ndOrder(currVals, TIMERATE);
        
        body1.x = newVals[0];
        body2.x = newVals[1];
        body3.x = newVals[2];
        body1.y = newVals[3];
        body2.y = newVals[4];
        body3.y = newVals[5];
        body1.vx = newVals[6];
        body2.vx = newVals[7];
        body3.vx = newVals[8];
        body1.vy = newVals[9];
        body2.vy = newVals[10];
        body3.vy = newVals[11];

        //collision detection
        if(distance13() < 2*RADIUS)
        {
            let resolved = collisionResolution(body1.x, body3.x, body1.y, body3.y, body1.vx, body3.vx, body1.vy, body3.vy, body1.mass, body3.mass);
            body1.x = resolved[0];
            body3.x = resolved[1];
            body1.y = resolved[2];
            body3.y = resolved[3];
            body1.vx = resolved[4];
            body3.vx = resolved[5];
            body1.vy = resolved[6];
            body3.vy = resolved[7];
        }
        if(distance12() < 2*RADIUS)
        {
            let resolved = collisionResolution(body1.x, body2.x, body1.y, body2.y, body1.vx, body2.vx, body1.vy, body2.vy, body1.mass, body2.mass);
            body1.x = resolved[0];
            body2.x = resolved[1];
            body1.y = resolved[2];
            body2.y = resolved[3];
            body1.vx = resolved[4];
            body2.vx = resolved[5];
            body1.vy = resolved[6];
            body2.vy = resolved[7];
        }
        if(distance23() < 2*RADIUS)
        {
            let resolved = collisionResolution(body2.x, body3.x, body2.y, body3.y, body2.vx, body3.vx, body2.vy, body3.vy, body2.mass, body3.mass);
            body2.x = resolved[0];
            body3.x = resolved[1];
            body2.y = resolved[2];
            body3.y = resolved[3];
            body2.vx = resolved[4];
            body3.vx = resolved[5];
            body2.vy = resolved[6];
            body3.vy = resolved[7];
        }
    }
    trail1.append(body1.x, body1.y);
    trail2.append(body2.x, body2.y);
    trail3.append(body3.x, body3.y);
    //energy display for verification
    let PE = potentialEnergy();
    let KE = kineticEnergy();
    let E = PE + KE;
    let com = COM();
    document.getElementById("Energy").innerHTML = "PE: " + Math.round(PE*1000)/1000 + " KE: " + Math.round(KE*1000)/1000 + " TE: " + Math.round(E*1000)/1000;
    document.getElementById("Mass").innerHTML = "Total mass: " + body1.mass + body2.mass + body3.mass;
    document.getElementById("COMx").innerHTML = Math.round(com[0]*1000)/1000;
    document.getElementById("COMy").innerHTML = Math.round(com[1]*1000)/1000;
    //wait timeRate
    window.requestAnimationFrame(drawBodies);
    
};

window.requestAnimationFrame(drawBodies);