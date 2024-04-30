# Like My Coffee Scoreboard
### by J.D. Lowe
_I like my lovers like I like my coffee: open source_

<img src="https://github.com/thejdlowe/like-my-coffee-scoreboard/assets/2357370/d96b879c-cc73-4bdd-8d4b-e44f2ba1b3a0" alt="drawing" width="200"/>

This is the software needed for the electron app that powers the Like My Coffee scoreboard! There are some requirements:

### Hardware

1. A Raspberry Pi 3 or higher (I happened to have a 3 to spare; it SHOULD work without any issues otherwise?)
2. An [X-Box 360 _Scene It?_ Infrared Receiver and corresponding controllers](https://en.wikipedia.org/wiki/Scene_It%3F_Lights,_Camera,_Action#Big_Button_Pad)

### Software

1. Do your normal Pi updates/upgrades/whatever.
2. Install https://github.com/micolous/xbox360bb and follow the instructions there for Raspberry Pi (you do not need to download the kernel bits; these are part of the updates/upgrades from above)
3. Install nodejs, npm, joystick (for testing) and samba (for writing code on another computer if you want your Pi headless while developing) via `apt-get install nodejs npm joystick samba`
4. Run `npm install electron` in whatever folder you want the project to be in
5. Copy and paste the files from this repo into there and then run `npm install` again. Voila!

### Hardships

1. This needs to be run as root. I know, it's ugly, but the Big Button drivers are legacy, and that's locked down like crazy, so you'll need `sudo npm run` to get it to detect.
   * This means that WebUSB by itself is not an option, as even when running with `sudo` it doesn't detect. It only detects with legacy drivers, so keep that in mind.
   * This is why `xhost +` is in the start script; this is required for it to have access.
2. You'll notice that electron is being run with `--disable-gpu-compositing`; this is not required if you have your Pi plugged into a monitor, but headless, there's a known issue with Electron.

### Future thoughts

I'd love to get a newer Raspberry Pi; the original goal was to write this in Electron and React, but trying to install that on a Raspberry Pi 3 was too taxing. Perhaps when I have room in my budget! Mayhaps, even!

That's...that's it I believe! 
