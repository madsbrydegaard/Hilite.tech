/* eslint-disable no-unused-vars */
import jQuery from 'jquery'
import './engine.cvh.js'
import game from '../../public/games/fck1/game.json'

var gameid = 'fck';
var mode = '';
var savedGame = null;

var engine = () => {
    return jQuery('#cvh').on('game.resumed', function (e) {
    }).on('game.paused', function (e, hasTimer) {
    }).on('chapter.started', function (e, engine, status) {
    }).on('game.ended', function (e, engine) {
    }).on('game.saved', function (e, engine) {
    }).cvhEngine({
        debug: true,
        autoplay: true,
        game: game,
        savedGame: savedGame,
        mode: mode
    }).contextmenu(function (e) { //Log offset on screen for editing
        //var parentOffset = jQuery(this).parent().offset();
        //or jQuery(this).offset(); if you really just want the current element's offset
        //var relX = e.pageX - parentOffset.left;
        //var relY = e.pageY - parentOffset.top;
        console.log(e);
        var relXP = e.pageX / jQuery(this).width() * 100;
        var relYP = e.pageY / jQuery(this).height() * 100;
    
        var api = jQuery(document).data('engine.cvh').player.api;
        var currentPos = api.ready ? api.video.time : 0;
        console.log("time: " + currentPos);
        console.log("xp: " + relXP.toFixed(1) + ", yp: " + relYP.toFixed(1) + "");
        return false;
    });
}

export default engine