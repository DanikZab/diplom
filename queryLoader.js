var QueryLoader = {
	/*
	 * QueryLoader		Preload your site before displaying it!
	 * Author:			Gaya Kessler
	 * Date:			23-09-09
	 * URL:				http://www.gayadesign.com
	 * Version:			1.0
	 * 
	 * A simple jQuery powered preloader to load every image on the page and in the CSS
	 * before displaying the page to the user.
	 */
	
	overlay: "",
	loadBar: "",
	preloader: "",
	items: new Array(),
	doneStatus: 0,
	doneNow: 0,
	selectorPreload: "body",
	ieLoadFixTime: 2000,
	ieTimeout: "",
		
	init: function() {
		if (navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/) == "MSIE 6.0,6.0") {
			//break if IE6			
			return false;
		}
		if (QueryLoader.selectorPreload == "body") {
			QueryLoader.spawnLoader();
			QueryLoader.getImages(QueryLoader.selectorPreload);
			QueryLoader.createPreloading();
		} else {
			$(document).ready(function() {
				QueryLoader.spawnLoader();
				QueryLoader.getImages(QueryLoader.selectorPreload);
				QueryLoader.createPreloading();
			});
		}
		
		//help IE drown if it is trying to die :)
		QueryLoader.ieTimeout = setTimeout("QueryLoader.ieLoadFix()", QueryLoader.ieLoadFixTime);
	},
	
	ieLoadFix: function() {
		var ie = navigator.userAgent.match(/MSIE (\d+(?:\.\d+)+(?:b\d*)?)/);
		if (ie[0].match("MSIE")) {
			while ((100 / QueryLoader.doneStatus) * QueryLoader.doneNow < 100) {
				QueryLoader.imgCallback();
			}
		}
	},
	
	imgCallback: function() {
		QueryLoader.doneNow ++;
		QueryLoader.animateLoader();
	},
	
	getImages: function(selector) {
		var everything = $(selector).find("*:not(script)").each(function() {
			var url = "";
			
			if ($(this).css("background-image") != "none") {
				var url = $(this).css("background-image");
			} else if (typeof($(this).attr("src")) != "undefined" && $(this).attr("tagName").toLowerCase() == "img") {
				var url = $(this).attr("src");
			}
			
			url = url.replace("url(\"", "");
			url = url.replace("url(", "");
			url = url.replace("\")", "");
			url = url.replace(")", "");
			
			if (url.length > 0) {
				QueryLoader.items.push(url);
			}
		});
	},
	
	createPreloading: function() {
		QueryLoader.preloader = $("<div></div>").appendTo(QueryLoader.selectorPreload);
		$(QueryLoader.preloader).css({
			height: 	"0px",
			width:		"0px",
			overflow:	"hidden"
		});
		
		var length = QueryLoader.items.length; 
		QueryLoader.doneStatus = length;
		
		for (var i = 0; i < length; i++) {
			var imgLoad = $("<img></img>");
			$(imgLoad).attr("src", QueryLoader.items[i]);
			$(imgLoad).unbind("load");
			$(imgLoad).bind("load", function() {
				QueryLoader.imgCallback();
			});
			$(imgLoad).appendTo($(QueryLoader.preloader));
		}
	},

	spawnLoader: function() {
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();
			var width = $(window).width();
			var position = "fixed";
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
			var width = $(QueryLoader.selectorPreload).outerWidth();
			var position = "absolute";
		}
		var left = $(QueryLoader.selectorPreload).offset()['left'];
		var top = $(QueryLoader.selectorPreload).offset()['top'];
		
		QueryLoader.overlay = $("<div></div>").appendTo($(QueryLoader.selectorPreload));
		$(QueryLoader.overlay).addClass("QOverlay");
		$(QueryLoader.overlay).css({
			position: position,
			top: top,
			left: left,
			width: width + "px",
			height: height + "px"
		});
		
		QueryLoader.loadBar = $("<div></div>").appendTo($(QueryLoader.overlay));
		$(QueryLoader.loadBar).addClass("QLoader");
		
		$(QueryLoader.loadBar).css({
			position: "relative",
			top: "50%",
			width: "0%"
		});
		
		QueryLoader.loadAmt = $("<div>0%</div>").appendTo($(QueryLoader.overlay));
		$(QueryLoader.loadAmt).addClass("QAmt");
		
		$(QueryLoader.loadAmt).css({
			position: "relative",
			top: "50%",
			left: "50%"
		});
	},
	
	animateLoader: function() {
		var perc = (100 / QueryLoader.doneStatus) * QueryLoader.doneNow;
		if (perc > 99) {
			$(QueryLoader.loadAmt).html("100%");
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { 
				QueryLoader.doneLoad();
			});
		} else {
			$(QueryLoader.loadBar).stop().animate({
				width: perc + "%"
			}, 500, "linear", function() { });
			$(QueryLoader.loadAmt).html(Math.floor(perc)+"%");
		}
	},
	
	doneLoad: function() {
		//prevent IE from calling the fix
		clearTimeout(QueryLoader.ieTimeout);
		
		//determine the height of the preloader for the effect
		if (QueryLoader.selectorPreload == "body") {
			var height = $(window).height();
		} else {
			var height = $(QueryLoader.selectorPreload).outerHeight();
		}
		
		//The end animation, adjust to your likings
		$(QueryLoader.loadAmt).hide();
		$(QueryLoader.loadBar).animate({
			height: height + "px",
			top: 0
		}, 500, "linear", function() {
			$(QueryLoader.overlay).fadeOut(800);
			$(QueryLoader.preloader).remove();
		});
	}
}
document.addEventListener('DOMContentLoaded', () => {
    createFireworks(10); // Количество фейерверков
});

function createFireworks(count) {
    const container = document.querySelector('.firework-container');
    
    for (let i = 0; i < count; i++) {
        // Задержка для последовательного запуска
        setTimeout(() => {
            createFirework(container);
        }, i * 300);
    }
    
    // Удаляем контейнер после завершения анимации
    setTimeout(() => {
        container.remove();
    }, count * 300 + 1500);
}

function createFirework(container) {
    const colors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
        '#ff00ff', '#00ffff', '#ff8800', '#ff0088'
    ];
    
    const particleCount = 50 + Math.floor(Math.random() * 50);
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайный угол и расстояние
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 150;
        
        // Вычисляем конечные координаты
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        // Устанавливаем CSS переменные
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Случайный цвет
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Случайная задержка для эффекта разброса
        particle.style.animationDelay = `${Math.random() * 0.2}s`;
        
        container.appendChild(particle);
        
        // Удаляем частицу после анимации
        setTimeout(() => {
            particle.remove();
        }, 1500);
    }
}
