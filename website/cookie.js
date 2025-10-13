class AutoProducer {
    constructor(game, cost = 15, pointsPerSecond = 1) {
        this.game = game;
        this.cost = cost;
        this.pointsPerSecond = pointsPerSecond;
        this.amount = 0;
    }

    buy() {
        if (this.game.score >= this.cost) {
            this.game.score -= this.cost;
            this.amount++;
            this.game.updateScoreDisplay();
            this.cost = Math.floor(this.cost * 1.5); 
            return true;
        }
        return false;
    }

    produce() {
        this.game.score += this.amount * this.pointsPerSecond;
        this.game.updateScoreDisplay();
    }
}

class Upgrade {
    constructor(game, name, cost, type, increase) {
        this.game = game;
        this.name = name;
        this.cost = cost;
        this.type = type; 
        this.increase = increase;
        this.purchased = false;
    }

    buy() {
        if (!this.purchased && this.game.score >= this.cost) {
            this.game.score -= this.cost;
            if (this.type === "click") this.game.pointsPerClick += this.increase;
            else if (this.type === "auto") this.game.autoProducer.pointsPerSecond += this.increase;
            this.purchased = true;
            this.game.updateScoreDisplay();
            return true;
        }
        return false;
    }
}

class CookieGame {
    constructor() {
        this.score = 0;
        this.pointsPerClick = 1;
        this.scoreDisplay = document.getElementById("score");
        this.cookie = document.getElementById("cookie");
        this.addClickListener();

        this.autoProducer = new AutoProducer(this, 15, 1);
        this.startAutoProduction();

        this.upgrades = [
            new Upgrade(this, "Click Power +1", 50, "click", 1),
            new Upgrade(this, "Auto Power +1", 100, "auto", 1)
        ];

        this.updateInventory();
    }

    addClickListener() {
        this.cookie.addEventListener("click", () => this.clickCookie());
    }

    clickCookie() {
        this.score += this.pointsPerClick;
        this.updateScoreDisplay();
        this.flashCookie();

        const clickSound = new Audio("cookie_click.mp3");
        clickSound.play();
    }

    updateScoreDisplay() {
        this.scoreDisplay.textContent = "Score: " + this.score;
    }

    startAutoProduction() {
        setInterval(() => {
            this.autoProducer.produce();
        }, 1000); 
    }

    updateInventory() {
        document.getElementById("auto-count").textContent = this.autoProducer.amount;

        const list = document.getElementById("upgrades-list");
        list.innerHTML = ""; 
        this.upgrades.forEach(upgrade => {
            if (upgrade.purchased) {
                const li = document.createElement("li");
                li.textContent = upgrade.name;
                list.appendChild(li);
            }
        });
    }

    flashCookie() {
        this.cookie.style.boxShadow = "0 0 20px #FFD700";
        setTimeout(() => this.cookie.style.boxShadow = "none", 150);
    }

    setTheme(theme) {
        const body = document.body;
        if (theme === "bakery"){ 
            body.style.backgroundImage = "url('bakery_bg.jpg')";
       } else {
            body.style.backgroundImage = "none";
            body.style.backgroundColor = "#4256b0";
        }
    }

    setCookieSkin(skin) {
        if (skin === "classic"){
            this.cookie.src = "cookie.png";
    } else if (skin === "chocolate") {
        this.cookie.src = "cookie_chocolate.png";
    }
  }
}

const game = new CookieGame();

// Flash button effect
function flashButton(button) {
    const originalColor = button.style.backgroundColor;
    button.style.backgroundColor = "#FFA500";
    setTimeout(() => button.style.backgroundColor = originalColor, 200);
}


document.getElementById("buy-auto").addEventListener("click", () => {
    if (game.autoProducer.buy()) {
        document.getElementById("buy-auto").textContent = `Buy Cookie Factory (${game.autoProducer.cost} points)`;
        game.updateInventory();
        flashButton(document.getElementById("buy-auto"));
    } else alert("Not enough points!");
});

document.getElementById("upgrade-click").addEventListener("click", () => {
    if (game.upgrades[0].buy()) { alert("Click Power +1 purchased!"); game.updateInventory(); }
    else alert("Not enough points or already purchased!");
});

document.getElementById("upgrade-auto").addEventListener("click", () => {
    if (game.upgrades[1].buy()) { alert("Auto Power +1 purchased!"); game.updateInventory(); flashButton(document.getElementById("upgrade-auto")); }
    else alert("Not enough points or already purchased!");
});


document.getElementById("theme-bakery").addEventListener("click", () => game.setTheme("bakery"));
document.getElementById("theme-default").addEventListener("click", () => game.setTheme("default"));
document.getElementById("skin-cookie1").addEventListener("click", () => game.setCookieSkin("classic"));
document.getElementById("skin-cookie2").addEventListener("click", () => game.setCookieSkin("chocolate"));



function spawnGoldenCookie() {
    const goldenCookie = document.createElement("img");
    goldenCookie.src = "golden_cookie.png";
    goldenCookie.id = "golden-cookie";
    goldenCookie.style.position = "absolute";
    goldenCookie.style.left = Math.random() * 500 + "px"; // willekeurige x positie
    goldenCookie.style.top = Math.random() * 300 + "px"; // willekeurige y positie
    goldenCookie.style.width = "100px";
    goldenCookie.style.cursor = "pointer";
    goldenCookie.style.zIndex = 1000;
    document.body.appendChild(goldenCookie);


    const appearSound = new Audio("golden_cookie_appear.mp3");
    appearSound.play();

    
    goldenCookie.addEventListener("click", () => {
        game.score += 50;
        game.updateScoreDisplay();

    
        goldenCookie.style.transform = "scale(1.2)";
        setTimeout(() => goldenCookie.remove(), 100);

        const clickSound = new Audio("golden_cookie_click.mp3");
        clickSound.play();
    });

    
    setTimeout(() => {
        if (goldenCookie.parentNode) goldenCookie.remove();
    }, 5000);
}

setInterval(() => {
    if (Math.random() < 0.5) { 
        spawnGoldenCookie();
    }
}, 20000); 
