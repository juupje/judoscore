# Judo score board

A full Judo scoreboard software in a *single HTML/JS project*.
Usable without webserver, just open main.html locally in your webbrowser. The resource folder is for convenience only.

![screenshot](screenshot.jpg?raw=true "Example view")

## Dual screen-setup

Opposed to the project that this one is forked from (see [here](https://github.com/tuxmike/judoscore)), this version features a dual screen setup. This means that the primary window is meant to be seen only by the judges. When the little square icon in the bottom left corner is clicked, a second window which only shows the scores and none of the click-able elements is pops up. This second window can be displayed on a second screen to the audience.

## Configuration
On first start or by navigating to the setting menu (gear icon in bottom-left corner), the configuration dialogue is opened.

## Operating
A brief usage description is included in the menu. Points are assigned via mouse control, either by left/right clicking on the specific element to increase/decrease or start/pause the score/clock or by clicking the plus, minus, play and pause icons, but there are also various shortcuts to control clocks, etc. Some elements such as the Golden Score can only be activated by a keyboard shortcut.

## Scoring

For the specific use-case this project was forked for, a third type of score (a 'yuko') was introduced. There is no upper limit to the amount of yukos that can be scored (though the display is limited to 99).

In the menu, there is an option to enable/disable autoscoring. If auto scoring is enabled, a confirmation message is shown if one of the competitors gains an ippon, a second Wazari or the opponent gains a third Shido. If the win is confirmed by the judge, the winner is shown on the screen (reset the window by pressing 'r').

## Own bell / horn / audio samples
Own audio files can be added in base64 embedded form <audio id="sound[n]" src="data:audio/ogg;base64,...>

## Licence
Free usage and modification for non-commercial use. 
(c) 2024 https://github.com/juupje/

Original project (c) 2019 https://github.com/tuxmike/
