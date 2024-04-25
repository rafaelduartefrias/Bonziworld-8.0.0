class msWindow {
    constructor(title, html, x, y, width, height, buttons) {
        this.x = x;
        this.y = y;
        this.toppad = 0;
        this.w = !width ? "auto" : width;
        this.h = !height ? "auto" : height;
        this.lx = x;
        this.ly = y;
        let btncounter = 0;
        html += "<br><br>"
        if (buttons == undefined) buttons = [{
            name: "Close"
        }]
        buttons.forEach((button) => {
            html += `<button id='${this.id}b${btncounter}'>${button.name}</button> `;
            button.id = btncounter;
            btncounter++;
        })
        document.body.insertAdjacentHTML("beforeend", `
            <div id='${this.id}p' style='top:${y}px;left:${x}px;height: ${height}px;width: ${width}px;' class='msWindow_cont'>
            <p id='${this.id}t' class='msWindow_title'>${title}<button class="log_close" id='${this.id}close'><i class='bi bi-x'></i></button></p>
            <div class='msWindow_body'>${html}</div>
            </div>
            `);
        //Button function handler
        buttons.forEach((button) => {
            document.getElementById(`${this.id}b${button.id}`).onclick = () => {
                if (button.callback != undefined) button.callback();
                this.kill();
            };
        })
        document.getElementById(`${this.id}close`).onclick = () => {
            this.kill()
        };
        //Move starter
        document.getElementById(`${this.id}t`).addEventListener("mousedown", mouse => {
            movestart(mouse, this)
        });
        this.w = document.getElementById(`${this.id}p`).clientWidth;
        this.h = document.getElementById(`${this.id}p`).clientHeight;
        this.check();
    }
    update() {
        document.getElementById(`${this.id}p`).style.left = this.x + "px";
        document.getElementById(`${this.id}p`).style.top = this.y + "px";
    }
    kill() {
        document.getElementById(`${this.id}p`).remove();
        delete this;
    }
    check() {
        if (this.x < 0) this.x = 0;
        else if (this.x > window.innerWidth - this.w - 25) this.x = window.innerWidth - this.w - 25;
        if (this.y < 0) this.y = 0;
        else if (this.y > window.innerHeight - this.h - 50) this.y = window.innerHeight - this.h - 50;
        this.update();
    }
}
