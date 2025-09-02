import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { load } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./App.css";
import { usePrayerTimes } from "./shared/api/usePrayerTimes";
import { buildRegionsSubmenu } from "./shared/utils/buildRegionsSubmenu";
import { getNextPrayerTime } from "./shared/utils/getNextPrayerTime";
import { getCurrentWindow } from "@tauri-apps/api/window";

const store = await load("store.json");

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Pop");
  const [tray, setTray] = useState<TrayIcon | null>(null);
  const navigate = useNavigate()

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
                action: () => navigate("/daily-times"),
              }),
              await MenuItem.new({
                id: "weekly",
                text: "Haftalik",
                action: () => navigate("/weekly-times"),
              }),
              await MenuItem.new({
                id: "monthly",
                text: "Oylik",
                action: () => navigate("/monthly-times"),
              }),
            ],
          }),
          await MenuItem.new({
            id: "quit",
            text: "Chiqish",
            action: async () => {
              const appWindow = await getCurrentWindow()
              await appWindow.hide()
            },
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

  return (
    <h1>salom</h1>
  );
};

export default App;
