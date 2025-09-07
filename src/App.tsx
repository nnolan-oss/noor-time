import { Menu, MenuItem, Submenu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { load } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import "./App.css";
import { usePrayerTimes } from "./shared/api/usePrayerTimes";
import { buildRegionsSubmenu } from "./shared/utils/buildRegionsSubmenu";
import { getNextPrayerTime } from "./shared/utils/getNextPrayerTime";
import { getCurrentWindow } from "@tauri-apps/api/window";

const store = await load("store.json");

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("Pop");
  const [tray, setTray] = useState<TrayIcon | null>(null);
  // const navigate = useNavigate()
  const { data: prayerData, isLoading } = usePrayerTimes(selectedRegion);

  // Load saved district on mount
  useEffect(() => {
    const loadSavedDistrict = async () => {
      const savedDistrict = await store.get<string>("selected_district");
      if (savedDistrict) {
        setSelectedRegion(savedDistrict);
      }
    };
    loadSavedDistrict();
  }, []);

  // Create tray menu when prayer data is available
  useEffect(() => {
    if (!prayerData || isLoading) return;

    const createTrayMenu = async () => {
      const regionsSubmenus = await buildRegionsSubmenu(async (district) => {
        setSelectedRegion(district);
        await store.set("selected_district", district);
      });

      // Create prayer times menu items
      const prayerTimeItems = await Promise.all(
        Object.entries(prayerData.times).map(async ([key, value]) =>
          await MenuItem.new({
            id: key,
            text: `${key}: ${value}`,
          })
        )
      );

      const trayMenu = await Menu.new({
        items: [
          await Submenu.new({
            text: "Hududlar",
            items: regionsSubmenus,
          }),
          await Submenu.new({
            text: "Namaz vaqtlari",
            items: prayerTimeItems,
          }),
          // await Submenu.new({
          // text: "Sozlamalar",
          // items: [
          // await MenuItem.new({
          // id: "daily",
          // text: "Kunlik ✓",
          // action: () => navigate("/daily-times"),
          // }),
          // await MenuItem.new({
          // id: "weekly",
          // text: "Haftalik",
          // action: () => navigate("/weekly-times"),
          // }),
          // await MenuItem.new({
          // id: "monthly",
          // text: "Oylik",
          // action: () => navigate("/monthly-times"),
          // }),
          // ],
          // }),
          await MenuItem.new({
            id: "quit",
            text: "Chiqish",
            action: async () => {
              const appWindow = await getCurrentWindow();
              await appWindow.hide();
            },
          }),
        ],
      });

      // Update existing tray menu instead of creating new tray
      if (tray) {
        await tray.setMenu(trayMenu);
      } else {
        const trayIcon = await TrayIcon.new({ menu: trayMenu });
        setTray(trayIcon);
      }
    };

    createTrayMenu();
  }, [prayerData, isLoading, selectedRegion]); // Add selectedRegion to dependencies

  useEffect(() => {
    if (!tray || !prayerData) return;

    const updateTrayTitle = () => {
      const prayerTime = getNextPrayerTime(prayerData.times);
      tray.setTitle(isLoading ? ".-." : `${prayerTime.key}: ${prayerTime.time}`);
    };

    updateTrayTitle();
    const intervalId = setInterval(() => {
      updateTrayTitle();
    }, 60_000);

    return () => clearInterval(intervalId);
  }, [tray, prayerData, isLoading]);

  return (
    ""
    // <h1>data:{JSON.stringify(prayerData)} {JSON.stringify(isLoading)}</h1>
  );
};

export default App;