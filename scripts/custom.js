const images = []; seed = (new Date()).getMilliseconds();


function startGame() { layers.push(new Layer()); load("Menu"); }


function load(scene) { clearObjects(); eval(`load${scene}()`); }


function loadGame() {
    layers[1].context.font = "200px Monaco, monospace";
    layers[1].context.textAlign = "center"; layers[1].context.textBaseline = "middle";

    objects.push(new Task()); objects.push(new Background()); objects.push(new Pet());
    for (let i = 0; i < 9; i++) objects.push(new NumButton(i));

    objects.push(new MenuButton(100, 100, 150, 150, images[8], () => { load("Menu"); }));
    objects[13].render();
}


function loadMenu() {
    objects.push(new Background());

    layers[1].context.font = "100px Monaco, monospace";
    layers[1].context.textBaseline = "middle"; layers[1].context.textAlign = "left";

    renderImage(images[7], new Vector4(100, 100, 150, 150), 1);
    renderImage(images[8], new Vector4(1080 - 100, 100, 150, 150), 1);
    renderImage(images[3], new Vector4(540, 550, 900, 900), 1);
    layers[1].context.fillText((localStorage.getItem("correct") != null ? localStorage.getItem("correct") : 0), 190, 100 + 10);
    layers[1].context.textAlign = "right";
    layers[1].context.fillText((localStorage.getItem("wrong") != null ? localStorage.getItem("wrong") : 0), 1080 - 190, 100 + 10);

    objects.push(new MenuButton(540, 960 + 250, 500, 500, images[4], () => { load("Game"); })); objects[2].render();
    objects.push(new MenuButton(540 + 300, 960 + 400 + 250, 350, 350, images[5], () => {
        if (navigator.share) {
            navigator.share({ title: "Math City", url: window.location.href }).catch(() => { alert("Что-то пошло не так"); })
        } else { alert("Извините! Ваш браузер не поддерживает Web Share API"); }
    })); objects[3].render();
    objects.push(new MenuButton(540 - 300, 960 + 400 + 250, 350, 350, images[6], () => { load("Contact"); })); objects[4].render();
    objects.push(new Studio());
}


function loadContact() {
    objects.push(new Background());
    layers[1].context.font = "50px Monaco, monospace";
    layers[1].context.textAlign = "center"; layers[1].context.textBaseline = "middle";
    let lines = ["Художники, 1А", "Софья Холодова", "", "Программист, 11Б", "Илья Холодов"];
    for (let i = 0; i < lines.length; i++) {
        layers[1].context.fillText(lines[i], 540, (i + 1) * 60);
    }
    objects.push(new MenuButton(100, 100, 150, 150, images[8], () => { load("Menu"); }));
    objects[2].render();
    objects.push(new MenuButton(1080 - 100, 1920 - 100, 150, 150, images[9], () => { window.open("https://vk.com/id450952979", "_blank").focus(); }));
    objects[3].render();
}


function loadAbout() {
    objects.push(new Background());
    objects.push(new MenuButton(100, 100, 150, 150, images[8], () => { load("Menu"); }));
    objects[2].render();

    renderImage(images[10], new Vector4(540, 1920 - 150, 300, 300), 1);
    layers[1].context.font = "70px Monaco, monospace";
    layers[1].context.textAlign = "center"; layers[1].context.textBaseline = "middle";
    let lines = ["VEINS Studio", "", "Мы - юная IT-компания,", "которая только начинает", "свой путь)", "", "Связаться с нами:", "veins-official@mail.ru"];
    for (let i = 0; i < lines.length; i++) {
        layers[1].context.fillText(lines[i], 540, 460 + (i + 1) * 90);
    }
}


function clearObjects() { for (let i = 1; i < objects.length; i++) { objects.splice(i, 1); i--; } for (let i = 0; i < layers.length; i++) clearTransform(new Vector4(540, 960, 1080, 1920), i); }


class Loader {
    constructor(images_count) { this.images_count = images_count; this.load_progress = 0; }

    load() {
        for (let i = 0; i < this.images_count; i++) {
            images.push(new Image()); images[i].src = "resources/images/" + i + ".png";
            images[i].onload = () => this.setLoadProgress(this.load_progress + 1);
        }
    }

    setLoadProgress(load_progress) {
        this.load_progress = load_progress; console.log("loading: " + float2int(this.load_progress / this.images_count * 100) + "%");
        if (this.load_progress === this.images_count) startGame();
    }
}


class Studio extends Button {
    constructor() { super(-75, 1920 - 75, 150, 150); }
    update() { super.update(); this.transform.position.x += 5; if(this.transform.position.x > 1080 + 75) this.transform.position.x = -75; }
    onRelease() { load("About"); }
    lateUpdate() { renderImage(images[10], this.transform, 0); }
}


class MenuButton extends Button {
    constructor(x, y, width, height, img, func) { super(x, y, width, height); this.img = img; this.func = func; }

    render() { renderImage(this.img, this.transform, 1); }

    animate(value) {
        clearTransform(this.transform, 1);
        this.transform.size.x += value;
        this.transform.size.y += value;
        this.render();
    }

    onRelease() { this.animate(20); this.func(); }
    
    onInterrupt() { this.animate(20); }
    
    onPress() { this.animate(-20); }
}


class Task extends GameObject {
    constructor() { super(540, 150, 700, 150); this.task; this.result; this.answer; this.mask = ""; this.t = 0; this.generateTask(); }

    lateUpdate() {
        if(this.mask === this.task) return;
        clearTransform(this.transform, 1);
        this.t += 0.3; this.mask = this.task.slice(0, float2int(this.t));
        layers[1].context.fillText(this.mask, this.transform.position.x, this.transform.position.y + 20);
    }

    generateTask() {
        let num1, num2; this.t = 0;
        if (random() > 0.5) {
            num1 = 1 + float2int(random() * 8);
            num2 = 1 + float2int(random() * (9 - num1))
            this.task = `${num1} + ${num2}`
            this.answer = num1 + num2;
        }
        else {
            num1 = 2 + float2int(random() * 9);
            num2 = 1 + float2int(random() * (num1 - 1))
            this.task = `${num1} - ${num2}`
            this.answer = num1 - num2;
        }
        // layers[1].context.fillText(this.task, this.transform.position.x, this.transform.position.y + 20);
    }

    setResult(value) {
        this.result = value;
        let correct = this.result == this.answer;
        if (correct) {
            localStorage.setItem("correct", Number(localStorage.getItem("correct")) + 1)
            objects[3].newPet(); this.generateTask();
        } else { localStorage.setItem("wrong", Number(localStorage.getItem("wrong")) + 1) }
        for(let i = 0; i < 7; i++) objects.push(new Partical(objects[3].transform.position.x, objects[3].transform.position.y, images[correct ? 7 : 8]));
    }
}


class NumButton extends MenuButton {
    constructor(value) {
        super(540 + (value - 3 * float2int(value / 3) - 1) * 300, 1410 + (float2int(value / 3) - 1) * 300, 300, 300, images[2], () => { objects[1].setResult(this.value); });
        this.value = value + 1; this.render();
    }
    render() { super.render(); layers[1].context.fillText(this.value, this.transform.position.x, this.transform.position.y + 20); }
}


class Background extends GameObject {
    constructor() { super(540, 960, 1080, 1920); }

    update() {
        this.transform.position.x += 2000/1920; if(this.transform.position.x > 1620) this.transform.position.x -= 1080;
        this.transform.position.y += 2000/1080; if(this.transform.position.y > 2880) this.transform.position.y -= 1920;
        this.render(new Vector2(float2int(this.transform.position.x), float2int(this.transform.position.y)));
    }

    render(position) {
        renderImage(images[1], new Vector4(position.x - 1080, position.y - 1920, this.transform.size.x, this.transform.size.y), 0)
        renderImage(images[1], new Vector4(position.x, position.y - 1920, this.transform.size.x, this.transform.size.y), 0)
        renderImage(images[1], new Vector4(position.x - 1080, position.y, this.transform.size.x, this.transform.size.y), 0)
        renderImage(images[1], new Vector4(position.x, position.y, this.transform.size.x, this.transform.size.y), 0)
    }
}


class Pet extends GameObject {
    constructor() { super(540, 600, 600, 600); this.c = 0; this.dir = true; this.img = float2int(random() * (images.length - 11)); this.went = 0; }

    update() {
        if(this.went > 0) {
            this.transform.position.x -= 70;
            if(this.dir) {
                if(this.transform.position.x < -this.transform.size.x / 2) {
                    this.transform.position.x += 1080 + this.transform.size.x;
                    this.img = float2int(random() * (images.length - 11));
                    this.dir = false; this.c = 0;
                }
            } else { if(this.transform.position.x < 540) { this.dir = true; this.went -= 1; } }
        } else {
            this.c += 0.05; if(this.c > 2 * Math.PI) this.c = 0;
            this.transform.position.x = float2int(540 + Math.sin(this.c) * 100);
        }
    }

    lateUpdate() { renderImage(images[11 + this.img], this.transform, 0); }

    newPet() { this.went += 1; }
}


class Partical extends GameObject {
    constructor(x, y, img) { super(x, y, 100, 100); this.img = img; this.velocity = new Vector2(float2int((random() - 0.5) * 50), -float2int(random() * 30)); }

    update() {
        this.velocity.y += 1; this.transform.position.x += this.velocity.x;
        this.transform.position.y += this.velocity.y;
        if(this.transform.position.y > 1920 + this.transform.size.y / 2) this.destroyed = true;
    }

    lateUpdate() { this.render(); }

    render() { renderImage(this.img, this.transform, 0); }
}


const loader = new Loader(14); loader.load();