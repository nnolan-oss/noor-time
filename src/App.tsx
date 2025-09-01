import "./App.css"
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from '@tauri-apps/api/tray';
import { useEffect } from "react";

const menu = await Menu.new({
  items: [
    {
      id: 'quit',
      text: 'Quit',
      action: () => {
        console.log("salom")
      }
    },
  ],
});

const options: TrayIconOptions = {
  menu,
  menuOnLeftClick: true,
};


const App = () => {
  const initTray = async () => {
    const tray = await TrayIcon.new(options);
    tray.setTitle(String(new Date().getMilliseconds()))
  }

  useEffect(() => {
    initTray()
  }, [])
  return ""
}

export default App
