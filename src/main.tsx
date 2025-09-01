import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon, TrayIconOptions } from '@tauri-apps/api/tray';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

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

const tray = await TrayIcon.new(options);
tray.setTitle("salom")
tray.setIcon("./32x32.png")

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
