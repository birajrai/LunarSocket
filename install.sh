echo -e "\n\n             Lunar Socket"
echo -e "       Easy Installation Script\n"

echo "Cloning the repo"
git clone https://github.com/Solar-Tweaks/LunarSocket &>/dev/null

echo "Installing Dependencies"
cd LunarSocket
npm install &>/dev/null
echo "Passing it onto the javascript script"
node scripts/init.js
