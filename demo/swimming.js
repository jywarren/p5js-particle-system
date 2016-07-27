$(document).ready(function() {
	animation();  
});
		var smoothEase = new Ease(BezierEasing(0.4, 0.2, 0.0, 1.0))
		function animation() {
			TweenMax.set("#fxContainer", {alpha:1});

			var tl = new TimelineMax();
			tl.timeScale(1);


			tl
			.from(".character", 0.7, {x:"200%", y:"200%", rotation:20, ease: Power3.easeOut}, 1)
			.to(".triangle", 0.5, {x:"0%", y:"%",  ease:Power1.easeOut}, "-=0.7")
			.staggerFromTo(".tri", 1.5, {alpha:0, x:40, y:40}, {alpha:1, x:90, y:70, ease:Power4.easeOut}, 0.04, "-=0.5")
			.staggerFromTo(".back", 1.5, {alpha:0, x:-20, y:-10}, {alpha:1,x:70, y:50, ease:Power4.easeOut}, 0.06, "-=1.8")

		

			
			.add([
				TweenMax.from(["#numbers", ".sport", ".infos"], 0.1, {alpha:0}),
				TweenMax.staggerTo(["#numbers", ".sport", ".infos"], 0.01, {alpha:1, delay:0.5}),
				TweenMax.staggerTo(["#numbers", ".sport", ".infos"], 0.01, {alpha:0.5, delay:0.1}), 
				TweenMax.staggerTo(["#numbers", ".sport", ".infos"], 0.01, {alpha:0.2, delay:0.2}),
				TweenMax.staggerTo(["#numbers", ".sport", ".infos"], 0.01, {alpha:0.7, delay:0.25}),
				TweenMax.staggerTo(["#numbers", ".sport", ".infos"], 0.01, {alpha:1, delay:0.3})
			], "-=1.5")

			

	
			
			//Comment this line to disable 3D Parallax
			.add(enableAnim, 0);
		}
		

		//Number Counter
		function counterStart() {
			//Last Number of the countdown animation
			lastNumber = "+=24"
			
			game = {score:0};
			display = document.getElementById("numbers")

			TweenMax.to(game, 1, {score:lastNumber, roundProps:"score", onUpdate:updateHandler, ease:Power4.easeNone});
					
			function updateHandler() {
				display.innerHTML = game.score;
			}
			
		}
		
		function bgTri_anim() {
			//Set Big Triangle rotation
			TweenMax.set(".triangleBg.one" + " .triangles", {rotation:90, transformOrigin:"50% 50%"});
			
			//Set Triangle unit transform origin to scale correctly
			TweenMax.set(".triangleBg.one" + " .bgTri.right", {transformOrigin:"40 80"});
			TweenMax.set(".triangleBg.one" + " .bgTri.left", {transformOrigin:"80 40"});

			//Trigger individual triangle scale with delay
			for (var i = 0; i <= 5; i++) {
				var row = ".triangleBg.one" + " .n0"+i
				TweenMax.staggerFromTo(row, 1, {scale:0, alpha:0}, {alpha:1, scale:1, delay:0.1 *i, ease:smoothEase} ,0.02)
			}
		}

		//Parallax 3D
		function enableAnim() {
				$('body').mousemove(function(event) {
						cx = Math.ceil($('body').width() / 2.0);
						cy = Math.ceil($('body').height() / 2.0);
						dx = event.pageX - cx;
						dy = event.pageY - cy;

						tiltx = (dy / cy);
						tilty = - (dx / cx);
						radius = Math.sqrt(Math.pow(tiltx,2) + Math.pow(tilty,2));
						degree = (radius * 10);
						TweenLite.set("#fxContainer", {transform:'rotate3d(' + tiltx + ', ' + tilty + ', 0, ' + degree + 'deg)'});
				});
		}
