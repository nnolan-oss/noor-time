import { MenuItem, Submenu } from "@tauri-apps/api/menu";
import { load } from "@tauri-apps/plugin-store";
import { regionsWithDistricts } from "../constants/regions";

const store = await load("store.json");

export async function buildRegionsSubmenu(onSelect: (district: string) => void) {
    const submenus: Submenu[] = [];

    for (const [region, districts] of Object.entries(regionsWithDistricts)) {
        const districtItems = await Promise.all(
            districts.map((district) =>
                MenuItem.new({
                    id: `${region}-${district}`,
                    text: district,
                    action: async () => {
                        console.log(`Selected: ${district} (${region})`);

                        // storega saqlash
                        await store.set("selected_region", region);
                        await store.set("selected_district", district);
                        await store.save();

                        // callback orqali React state yangilash
                        onSelect(district);
                    },
                })
            )
        );

        const submenu = await Submenu.new({
            text: region,
            items: districtItems,
        });

        submenus.push(submenu);
    }

    return submenus;
}
