angular.module("particles", [])
    .directive("explosion", ["$interval",
        function($interval) {
            return {
                restrict: "C",
                template: "<canvas></canvas",
                replace: true,
                transclude: true,
                scope: {
                    particle: "@",
                    count: "=",
                    speed: "=",
                    size: "=",
                    colors: "=",
                    spawn: "="
                },
                link: function(scope, element, attrs) {
                    console.log("Starting canvas ", scope.particle);
                    var ctx = element[0].getContext('2d');
                    var particles = [];
                    var width, height;
                    var maxCount = scope.count || 100;
                    var maxSpeed = scope.speed || 150;
                    var maxSize = scope.size || 10;
                    var colors = scope.colors || ['#f00'];
                    var spawnTime = scope.spawn ? 1000 / scope.spawn : 10;
                    var resize = function() {
                        element.attr({
                            width: $('body').width(),
                            height: $('body').height()
                        });

                        width = element.attr('width');
                        height = element.attr('height');

                        console.log("Size ", width, "x", height);
                    };
                    var spawn = function() {
                        particles.push({
                            x: width / 2,
                            y: height / 2,
                            v: {
                                x: (maxSpeed << 1) * Math.random() - maxSpeed,
                                y: (maxSpeed << 1) * Math.random() - maxSpeed
                            },
                            s: Math.random() * maxSize,
                            a: 1,
                            c: colors[Math.floor(Math.random() * colors.length)]
                        });
                    };
                    var draw = function() {
                        ctx.clearRect(0, 0, width, height);
                        for (var i = 0; i < particles.length; i++) {
                            var p = particles[i];
                            ctx.globalAlpha = p.a;
                            ctx.fillStyle = p.c;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.s, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                    };
                    var lastSpawned = 0;
                    var update = function(delta) {

                        lastSpawned += delta;
                        while (lastSpawned > spawnTime) {
                            lastSpawned -= spawnTime;
                            spawn();
                        }
                        var particleOverflow = particles.length - maxCount;
                        if (particleOverflow > 0) {
                            particles.splice(0, particleOverflow);
                        }

                        for (var i = 0; i < particles.length; i++) {
                            var p = particles[i];
                            p.x += p.v.x * delta / 1000;
                            p.y += p.v.y * delta / 1000;
                            p.a *= 0.99;
                        }
                    };
                    var finished = false;
                    var time;
                    var animate = function(elapsed) {
                        if (!time)
                            time = elapsed;

                        var delta = elapsed - time;
                        time = elapsed;
                        update(delta);
                        draw();

                        if (!finished) window.requestAnimationFrame(animate);
                    };

                    resize();
                    $(window).on('resize', resize);
                    window.requestAnimationFrame(animate);
                    scope.$on("$destroy", function() {
                        finished = true;
                    });
                }
            };
        }
    ]);