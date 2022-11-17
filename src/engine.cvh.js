import jQuery from 'jquery'
import 'flowplayer/dist/skin/skin.css'
import './engine.cvh.css'
(function ($) {
    $.fn.cvhEngine = function (config) {

        return this.each(function () {
            var $this = $(this);
            var engine = $.extend({
                results: [],
                playerClass: '.player',
                roundBtnClass: '.round',
                actionBtnClass: '.action',
                scoreClass: '.score',
                timeClass: '.time',
                timerClass: '.timer',
                curtainClass: '.curtain',
                messageClass: '.text',
                toggleClass: '.toggleX',
                continueSavedGame: function (savedGame) {
                    var me = this;

                    //if saved game - recreate starting point
                    if (savedGame) {

                        var time = (savedGame.HighScore - 500) * -10;
                        me.results.push({ time: time, correct: true });
                        var temp = [];

                        for (var i = 0; i < me.game.currentChapters.length; i++) {
                            if (me.game.currentChapters[i].name === savedGame.Status) {
                                temp = me.game.currentChapters.slice(i);
                            }
                        }
                    }
                    me.game.currentChapters = temp;

                    //Init first clip
                    me.nextChapter();
                },
                nextChapter: function () {
                    var me = this;
                    //
                    if (me.game.currentChapters.length) {
                        var nextChapter = me.game.currentChapters.shift();

                        //Init clip
                        me.initChapter(nextChapter, me.game.path || '/');

                        //Raise event
                        $this.triggerHandler('chapter.started', [me, nextChapter.name]);
                    } else {
                        //Game ended

                        //Raise event
                        $this.triggerHandler('game.ended', [me]);
                    }
                },
                init: function () {
                    var me = this;
                    $this.attr('data-role', 'cvh.engine');

                    me.$scoreLabel = $('<div />').addClass(this.scoreClass.substring(1)).hide().appendTo($this);
                    me.$timerLabel = $('<div />').addClass(this.timerClass.substring(1)).hide().appendTo($this);
                    me.$curtain = $('<div id="curtain"/>')
                        .addClass(this.curtainClass.substring(1))
                        .append('<div class="center"><div><div class="lds-ripple"><div></div><div></div></div></div></div>') //Add ripple (loader) animation
                        .appendTo($this);
                    me.$timeLabel = $('<div/>').addClass(this.timeClass.substring(1)).appendTo($this);
                    //me.$toggleLabel = $('<div/>').addClass(this.toggleClass.substring(1)).appendTo($this).on('click', function () {
                    //    if ($this.hasClass('is-paused')) {
                    //        //me.resume();
                    //    } else {
                    //        //me.pause();
                    //    }
                    //});

                    //Create button and read width & height
                    var roundBtnClass = $this.data('button-class') || this.roundBtnClass.substring(1);
                    var $actionBtn = $('<div />').addClass(roundBtnClass).css({ 'opacity': 0 }).appendTo($this);
                    me.actionBtnWidth = $actionBtn.outerWidth(true);
                    me.actionBtnHeight = $actionBtn.outerHeight(true);
                    $actionBtn.remove();

                    //Test game object
                    if (!me.game.chapters) { throw 'No clips in game'; }
                    me.game.currentChapters = me.game.chapters.slice(0);

                    //Raise event
                    $this.triggerHandler('game.initiated', [this]);
                    
                    //console.log(savedGame);
                    if (me.savedGame) {
                        me.continueSavedGame(me.savedGame);
                    }
                    else {
                        //Init first clip
                        me.nextChapter();
                    }

                    //Return
                    return this;
                },
                initChapter: function (chapter, path) {
                    var me = this;

                    //Test chapter object
                    if (!chapter) { throw 'No chapter'; }
                    //if (!clip.videoFile) { throw 'No clip videofile'; }
                    if (!chapter.actionFile) { throw 'No chapter action file'; }

                    var actionFile = [path, chapter.actionFile].join('');
                    var videoFile = [path, chapter.videoFile].join('');
                    
                    //Player Init event
                    flowplayer(function (api, root) {
                        me.player = { 'api': api, 'root': $(root) };

                        //me.player.api.cuepoints = me.actions;
                        api.on("progress", function (e, api, time) {
                            me.$timeLabel.text(time);
                            var action = chapter.currentActions.find((me, val, i) => me.time <= time);
                            if (action) {
                                chapter.currentActions.shift();
                                me.execCuepoint(action);
                            }
                        }).on("pause", function (e, api) {
                            $this.addClass('is-paused');
                            //$this.triggerHandler('game.paused');
                        }).on("resume", function (e) {
                            //api.disable(false);
                            $this.removeClass('is-paused');
                            //$this.triggerHandler('game.resumed');
                        });

                        //Raise event
                        $this.triggerHandler('chapter.initiated', [this]);
                    });

                    $.getScript(actionFile, function (json) {

                        //Store chapter actions
                        chapter.actions = JSON.parse(json);
                        
                        if (chapter.videoFile) {
                            //Init player
                            me.$player = $('<div />').appendTo($this);
                            flowplayer(me.$player, {
                                autoplay: me.autoplay,
                                muted: true,
                                share: false,
                                //disabled: true,
                                clip: {
                                    sources: [
                                        {
                                            type: "video/mp4",
                                            src: chapter.videoFile
                                        }
                                    ]
                                }
                            });
                        }

                        //Clone copy for safe manipulation
                        chapter.currentActions = chapter.actions.slice(0);

                    }).fail(function (e) {
                        throw 'Error in fetching json';
                    });

                    //Set score to initial value
                    me.updateScore();
                },
                score: function () {
                    var sum = 0;
                    for (var i = 0; i < this.results.length; i++) {
                        sum += this.results[i].correct ? 500 - (this.results[i].time / 10) : 0;
                    }
                    return sum;
                },
                alert: function (options) {
                    var $alert = $('<div/>').hide()
                        .addClass(options.class || 'alert')
                        .html(options.content)
                        .appendTo($this).fadeIn(function () {
                            setTimeout(function () {
                                $alert.fadeOut(function () {
                                    $alert.remove();
                                })
                            }, options.duration || 2000);
                        });
                    return this;
                },
                updateScore: function () {
                    this.$scoreLabel.show().html(this.score());
                    return this;
                },
                goto: function (time, play, volume) {
                    var me = this;
                    if (volume) { me.player.api.volume(volume); }

                    me.$curtain.fadeIn(function () {
                        //Fast foward
                        me.player.api.seek(time, function () {
                            //Fade from black
                            me.$curtain.fadeOut(function () {
                                console.log(time, me.player.api.video.time);
                                if (play) { me.resume(); }
                            });
                        });
                    });
                    return this;
                },
                end: function () {
                    var me = this;
                    me.$curtain.fadeIn(function () {
                        me.player.api.stop();
                        me.player.api.unload();
                        me.$player.remove();

                        $this.triggerHandler('clip.ended', [me.score()]);

                        //next clip
                        me.nextChapter();
                    });
                    return this;
                },
                pause: function (hasTimer) {
                    var me = this;
                    //reset
                    me.player.api.speed(0);
                    $this.triggerHandler('game.paused', [hasTimer]);
                    return this;
                },
                mute: function () {
                    var me = this;

                    //mute
                    me.player.api.mute();
                    me.player.api.volume(0);
                    return this;
                },
                vol: function (volume) {
                    var me = this;

                    //set volume
                    me.player.api.volume(volume);
                    return this;
                },
                resume: function () {
                    var me = this;
                    //reset
                    me.player.api.speed(1);
                    $this.triggerHandler('game.resumed');
                    return this;
                },
                reset: function () {
                    var me = this;
                    //$(me.actionBtnClass, $this)
                    //    .not('.clicked')
                    //    .remove();

                    //Wait .5 s
                    setTimeout(function () {
                        $(me.actionBtnClass, $this).remove();
                    }, 500);

                    //reset
                    me.$timerLabel.hide();

                    //
                    me.updateScore();

                    return this;
                },
                go: function () {
                    var me = this;
                    me.reset();
                    me.resume();
                    return this;
                },
                execCuepoint: function (cuepoint) {
                    var me = this;

                    if (cuepoint.pause) { me.pause(); }
                    if (cuepoint.mute) { me.mute(); }

                    else if (cuepoint.volume) { me.vol(cuepoint.volume); }
                    else { me.vol(1); }

                    if (cuepoint.end) {
                        if (me.mode === 'edit') { return; }
                        me.end();
                    }
                    else if (cuepoint.goto) {
                        me.goto(cuepoint.goto);
                    }
                    else if (cuepoint.plugin) {
                        cuepoint.plugin.run(this, cuepoint);
                    }
                    else if (cuepoint.hilite) {
                        if (cuepoint.hilite.pause) {
                            me.pause();
                        }

                        if (cuepoint.hilite.hidden) { return; }
                        if (cuepoint.hilite.element) {
                            //console.log(1, cuepoint.hilite.element());
                            $(cuepoint.hilite.element()).vcHilite(cuepoint.hilite)
                                .one('hide.hilite.cvh', function () {
                                    if (cuepoint.hilite.onDismissed) { cuepoint.hilite.onDismissed(); }
                                });
                        } else {
                            //console.log(2, cuepoint);
                            var wa = me.actionBtnWidth; //Button width
                            var ha = me.actionBtnHeight; //Button height
                            var w = $this.width(); //Player width
                            var h = $this.height(); //Player height

                            var x = w * ((cuepoint.hilite.xp / 100)) - (wa / 2); //Button left
                            var y = h * ((cuepoint.hilite.yp / 100)) - (ha / 2); //Button top

                            $('<div />')
                                .addClass('hilite')
                                .css({
                                    left: x,
                                    top: y,
                                    zIndex: 12
                                })
                                .appendTo($this)
                                .vcHilite(cuepoint.hilite)
                                .one('hide.hilite.cvh', function () {
                                    $(this).remove();
                                    if (cuepoint.hilite.onDismissed) { cuepoint.hilite.onDismissed(); }
                                });

                            $(cuepoint.hilite.coords).each(function (i, n) {
                                x = w * ((n.xp / 100)) - (wa / 2); //Button left
                                y = h * ((n.yp / 100)) - (ha / 2); //Button top

                                //Adjust if outside visible area
                                if ((x + wa) > w) { x = w - wa; }
                                if ((y + ha) > h) { y = h - ha; }

                                $('<div />')
                                    .addClass(me.actionBtnClass.substring(1))
                                    .data('correct', n.correct)
                                    .css({
                                        left: x,
                                        top: y,
                                        zIndex: 12
                                    })
                                    .on('mousedown', function (e) {
                                        //me.results.push({ time: 1000, correct: $(this).data('correct') });
                                        $(this).addClass($(this).data('correct') ? 'correct clicked' : 'incorrect clicked');

                                        if ($(document).data('hilite.cvh')) {
                                            $(document).data('hilite.cvh').hide();
                                        }

                                        me.reset();
                                        return false;
                                    })
                                    .appendTo($this);

                            });
                        }
                    }
                    else if (cuepoint.messageUrl) {
                        //

                        $('<div class="curtain"/>').load(me.game.path + cuepoint.messageUrl, function () {
                            $curtain = $(this);
                            $curtain.hide().appendTo($this).fadeIn(function () {
                                $curtain.vcLoader().find('[data-dismiss]')
                                    .on('click', function (e) {
                                        if ($(this).data('dismiss') === 'message') {
                                            $curtain.fadeOut(function () {
                                                $curtain.remove();
                                                if (cuepoint.onDismissed) {
                                                    cuepoint.onDismissed.call(me);
                                                }
                                            });
                                        }
                                    });

                                if (cuepoint.timeout === undefined || cuepoint.timeout > 0) {
                                    me.$timerLabel
                                        .show()
                                        .off()
                                        .on('done', function () {
                                            $curtain.fadeOut(function () {
                                                $curtain.remove();
                                                if (cuepoint.onDismissed) {
                                                    cuepoint.onDismissed.call(me);
                                                }
                                            });
                                        })
                                        .cvhCounter(cuepoint.timeout || 10);
                                }
                            });
                        });
                    }
                    else if (cuepoint.message) {
                        //
                        $(cuepoint.message[0]).hide().appendTo($this).fadeIn(function () {
                            var $message = $(this);
                            $message.find('[data-dismiss]')
                                .on('click', function (e) {
                                    if ($(this).data('dismiss') === 'message') {
                                        $message.fadeOut(function () {
                                            $message.remove();
                                            if (cuepoint.onDismissed) {
                                                cuepoint.onDismissed.call(me);
                                            }
                                        });
                                    }
                                });
                        });

                    }
                    else if (cuepoint.quiz) {
                        me.pause(true);
                        //Fade to black
                        var $quiz = $('<div class="quiz"><div class="top25">' + cuepoint.quiz.question + '</div><div class="answers"></div></div>').appendTo($this);
                        var $answers = $('.answers', $quiz);

                        $(cuepoint.quiz.answers).each(function (i, n) {
                            $('<button />')
                                .addClass(me.actionBtnClass.substring(1))
                                .addClass('btn btn-light btn-sm mx-1')
                                .text(n.text)
                                .data('correct', n.correct)
                                .click(function (e) {
                                    var time = 1000;
                                    if (me.$timerLabel.data('counter')) {
                                        time = me.$timerLabel.data('counter').stop().getTimer()
                                    }
                                    me.results.push({ time: time, correct: $(this).data('correct') });
                                    $(this).removeClass('btn-light').addClass($(this).data('correct') ? 'btn-success clicked' : 'btn-danger clicked');
                                    e.stopPropagation();
                                    $this.triggerHandler('action.ended', [me, cuepoint, n]);
                                    $quiz.fadeOut(function () { $quiz.remove(); });
                                    me.go();
                                    return false;
                                }).appendTo($answers);
                        });

                        if (cuepoint.timeout === undefined || cuepoint.timeout > 0) {
                            me.$timerLabel
                                .show()
                                .off()
                                .on('done', function () {
                                    //console.log('done')
                                    me.results.push({ time: 0, correct: false });
                                    $this.triggerHandler('action.ended', [me, cuepoint]);
                                    $quiz.fadeOut(function () { $quiz.remove(); });
                                    me.go();
                                })
                                .cvhCounter(cuepoint.timeout || 10);
                        }
                    }
                    else if (cuepoint.coords) {
                        if (me.mode === 'edit') { return; }
                        me.pause(true);
                        let wa = me.actionBtnWidth; //Button width
                        let ha = me.actionBtnHeight; //Button height
                        let w = $this.width(); //Player width
                        let h = $this.height(); //Player height
                        let ratio = me.player.api.conf.ratio;

                        // console.log('wa', me.actionBtnWidth);
                        // console.log('ha', me.actionBtnHeight);

                        //Adjust according to aspect ratio
                        let vw = Math.ceil(h / ratio); //Exact Width of video
                        let xdif = (w - vw) / 2; // Diff / 2 - (video width - screen width)

                        vw = vw > w ? w : vw; // If ide width bigger than width - assume video width = width
                        xdif = xdif > 0 ? xdif : 0; // If xdif less than 0 - xdif assume 0

                        //console.log(w, h, ratio, vw, xdif);

                        $(cuepoint.coords).each(function (i, n) {
                            //console.log(n);

                            x = vw * ((n.xp / 100)) - (wa / 2); //Button left
                            y = h * ((n.yp / 100)) - (ha / 2); //Button top

                            //Add adjustment for incorrect aspect ratio
                            x += xdif;
                            //console.log('(x + wa)', (x + wa));
                            //console.log('x,y', x,y);

                            //console.log('w', w);
                            //console.log((x + wa) > w);
                            
                            //Adjust if outside visible area
                            if ((x + wa) > w) { x = w - wa; }
                            if ((y + ha) > h) { y = h - ha; }

                            //console.log(x, y);

                            var $cp = $($('<div />')
                                .addClass(me.roundBtnClass.substring(1))
                                .addClass(me.actionBtnClass.substring(1))
                                .data('correct', n.correct)
                                .css({
                                    left: x,
                                    top: y,
                                    zIndex: 12
                                }))
                                .click(function (e) {
                                    //console.log(2, me.$timerLabel.data('counter'));
                                    if (me.$timerLabel.data('counter')) {
                                        me.results.push({ time: me.$timerLabel.data('counter').stop().getTimer(), correct: $(this).data('correct') });
                                    }
                                    $(this).addClass($(this).data('correct') ? 'correct clicked' : 'incorrect clicked');
                                    me.go();
                                    e.stopPropagation();
                                    $this.triggerHandler('action.ended', [me, cuepoint, n]);
                                    return false;
                                })
                                .appendTo($this);

                        });

                        if (cuepoint.timeout === undefined || cuepoint.timeout > 0) {
                            me.$timerLabel
                                .show()
                                .off()
                                .on('done', function () {
                                    //console.log('done')
                                    me.results.push({ time: 0, correct: false });
                                    me.go();
                                    $this.triggerHandler('action.ended', [me, cuepoint]);
                                })
                                .cvhCounter(cuepoint.timeout || 10);
                        }
                    }

                    $this.triggerHandler('action.started', [me, cuepoint]);
                }
            }, config, {});
            
            $(document)
                .removeData('engine.cvh')
                .data('engine.cvh', engine.init());
        });
    };

    $.fn.cvhCounter = function (seconds) {
        if (seconds === 0) { return $(this); }
        if ($(this).data('counter') && $(this).data('counter').stop) { $(this).data('counter').stop(); }
        var $this = $(this).data('counter', {});
        var $bar = $($('.progress', $this)[0] || $this.append('<progress id="progress" class="progress" value="0" max="100"></progress>').find('.progress'));

        $.extend($this.data('counter'), {
            delta: 10,
            duration: seconds * 1000,
            timer: 0,
            $bar: $bar,
            handle: null,
            start: function () {
                var me = this;
                me.handle = setInterval(function () {
                    if (me.timer > me.duration) { me.stop(); $this.trigger('done'); return; }
                    me.timer += me.delta;
                    me.percent = (me.timer / me.duration * 100);
                    // if (me.percent <= 5) { me.$bar.removeClass('progress-bar-warning').removeClass('progress-bar-danger').addClass('progress-bar-success'); }
                    // if (me.percent > 75) { me.$bar.removeClass('progress-bar-success').addClass('progress-bar-warning'); }
                    // if (me.percent > 90) { me.$bar.removeClass('progress-bar-success').addClass('progress-bar-danger'); }
                    
                    me.$bar.attr('value', me.percent)
                    //me.$bar.innerText = Math.round(me.percent) + '%';
                }, me.delta);

                return me;
            },
            stop: function () {
                //this.bar.width('0%');
                clearInterval(this.handle);
                return this;
            },
            getTimer: function () {
                return this.timer;
            }
        }).start();

        return $this;
    };
})(jQuery);