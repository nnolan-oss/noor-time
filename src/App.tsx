import "./App.css";
import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { useEffect, useState } from "react";
import { buildRegionsSubmenu } from "./shared/utils/buildRegionsSubmenu";
import { load } from "@tauri-apps/plugin-store";
import { usePrayerTimes } from "./shared/api/usePrayerTimes";
import { getNextPrayerTime } from "./shared/utils/getNextPrayerTime";

const store = await load("store.json");

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Pop");
  const [tray, setTray] = useState<TrayIcon | null>(null);

  const { data: prayerData, refetch: prayerTimeRefetch } = usePrayerTimes(selectedRegion);

  useEffect(() => {
    const init = async () => {
      const savedDistrict = await store.get<string>("selected_district");
      if (savedDistrict) {
        setSelectedRegion(savedDistrict);
      }

      const regionsSubmenus = await buildRegionsSubmenu((district) => {
        setSelectedRegion(district);
      });
      const trayMenu = await Menu.new({
        items: [
          await Submenu.new({
            text: "Hududlar",
            items: regionsSubmenus,
          }),
          await Submenu.new({
            text: "Sozlamalar",
            items: [
              await MenuItem.new({
                id: "daily",
                text: "Kunlik ✓",
                action: () => console.log("Kunlik tanlandi"),
              }),
              await MenuItem.new({
                id: "weekly",
                text: "Haftalik",
                action: () => console.log("Haftalik tanlandi"),
              }),
              await MenuItem.new({
                id: "monthly",
                text: "Oylik",
                action: () => console.log("Oylik tanlandi"),
              }),
            ],
          }),
          await MenuItem.new({
            id: "quit",
            text: "Chiqish",
            action: () => window.close(),
          }),
        ],
      });

      const trayIcon = await TrayIcon.new({ menu: trayMenu });
      setTray(trayIcon);
    };

    init();
  }, []);

  useEffect(() => {
    if (tray && prayerData) {

      const pp = getNextPrayerTime(prayerData?.times)

      tray.setTitle(`${pp.key}: ${pp.time}`);
      console.log(pp.key, "sss");
      prayerTimeRefetch()
    }
    console.log(JSON.stringify(prayerData?.times))
  }, [tray, prayerData]);

  return "";
};

export default App;
