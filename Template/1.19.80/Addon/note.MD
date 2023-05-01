## How to install Minercaft Bedrock node js (@minercaft/server)
First Go to this website [Click Here.](https://www.npmjs.com/package/@minecraft/server?activeTab=versions)


Using "Ctrl + F" and find "stable" look the first one copy it ex:
- 1.2.0-beta.1.19.80-stable
- 1.1.0-beta.1.19.70-stable
- 1.1.0-beta.1.19.60-stable

## How to install Minercaft Bedrock node js (@minercaft/server-ui)
First Go to this website [Click Here.](https://www.npmjs.com/package/@minecraft/server-ui?activeTab=versions)

Using "Ctrl + F" and find "stable" look the first one copy it ex:
- 1.0.0-beta.1.19.80-stable
- 1.0.0-beta.1.19.70-stable
- 1.0.0-beta.1.19.60-stable



## for "@minercaft/server" and "@minercaft/server-ui" you need to
check it correctly at "manifest.json" use that your copy is **MAIN**

if it not correctly just change "manifest.json" like the number

###

POV: Your copy "@minecraft/server" version is "1.2.0-beta.1.19.80-stable"

template:
```json
"dependencies": [{
		"module_name": "@minecraft/server",
		"version": "1.0.0-beta"
	},
    {
		"module_name": "@minecraft/server-ui",
		"version": "1.0.0-beta"
	}
]
```

look at number and -beta "**1.2.0-beta**.1.19.70-stable"

replace 1.0.0 to 1.2.0(or number that you copy`)
```json
"dependencies": [{
		"module_name": "@minecraft/server",
		"version": "1.2.0-beta"
	},
    {
		"module_name": "@minecraft/server-ui",
		"version": "1.0.0-beta"
	}
]
```

## Open Folder
In **Visual Studio Code** (Ctrl + Shift + `)
- Click "File" at top **nav bar**
- And then "Open Folder"
- Using this "%LocalAppData%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\minecraftWorlds"
- Finding Your World
- Click behavior_packs
- Selection Your Addon
- Prees OK (or something that mean done)
## Install Node js
Go to this website [here.](https://nodejs.org/en) Dowloade Recommented Version and click next next..
- Make sure your selection folder..
- Click On "Terminal" at top **nav bar**
- and click "New Terminal"
- use "npm i @minecraft/server@[Something Your Copy for Server]" ex "npm i @minecraft/server@1.1.0-beta.1.19.70-stable"
- done for @minecraft/server next is @minecraft/server-ui
- use "npm i @minecraft/server-ui@[Something Your Copy for Server-ui]" ex "npm i @minecraft/server-ui@1.0.0-beta.1.19.70-stable"