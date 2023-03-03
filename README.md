# LunarSocket

Lunar Socket is a Websocket server for Lunar Client.
It allows you to proxy the connection between Lunar Client and Lunar Servers. (To give you cosmetics or emotes for example)

Lunar Client &lt;-> Lunar Socket &lt;-> Lunar Servers

It intercepts and edits the data in sent packets.

# 🔖 Protocol

You can see Lunar Client protocol detailed [here](https://github.com/Solar-Tweaks/LunarSocket/blob/main/doc/protocol.md)

# ⬇️ Installation

```bash
$ git clone https://github.com/Solar-Tweaks/LunarSocket # Clone repo
$ cd LunarSocket # Go to LunarSocket folder
$ npm install # Install dependencies
$ npm run build # Build the project

# For the dashboard
$ cd dashboard # Go to the dashboard folder
$ npm install # Install dependencies
$ npm run build # Build the dashboard
```

# 💻 Installation using Script

```bash
$ git clone https://github.com/Solar-Tweaks/LunarSocket # Clone repo
$ cd LunarSocket # Go to LunarSocket folder
$ npm install # Install dependencies
$ npm run init # Execute the init script, which installs all dependencies and builds the project and dashboard
```
or (Linux and MacOS only)

```bash
curl https://raw.githubusercontent.com/Solar-Tweaks/LunarSocket/main/install.sh | bash
```

or

```bash
git clone https://github.com/Solar-Tweaks/LunarSocket && cd LunarSocket && npm install && npm run init
# Do the script installation but with just 1 command
```

# 🔧 Configuration

Open the `config.example.json` file and edit the values.
Once you have edited the file, save it as `config.json` and start the server.

# 📂 Databases

There are a few types of databases available:

- `instanceStorage` - Stores the data in the Lunar Socket instance which means that the data will be deleted when the server is restarted/stopped/updated.
- `mongo` - Stores the data in a MongoDB database.
- `fileStorage` - Stores the data in the provided json file.

# Permission system

You can add permissions for roles, the permission is very easy. The permissions
for a command is simply `command.<NAME>` where `<NAME>` is the command name.
For example `command.broadcast` is the permission for the broadcast command.

Here is a list of the special permissions:

- `*` - All permissions
- `customization.displayColor` - Let the user put a custom icon color through the API
- `customization.displayIconColor` - Let the user put a custom plus color through the API

_More the come soon with customization 👀_

# 🚀 Starting the server

```bash
$ npm start
```
