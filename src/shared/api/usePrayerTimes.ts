import { useQuery } from "@tanstack/react-query";
import { namazApi } from "./namazTimeClient";

export interface PrayerTimes {
    region: string;
    date: string;
    weekday: string;
    hijri_date: {
        month: string;
        day: number;
    };
    times: {
        tong_saharlik: string;
        quyosh: string;
        peshin: string;
        asr: string;
        shom_iftor: string;
        hufton: string;
    };
}

export const usePrayerTimes = (region: string) => {
    return useQuery<PrayerTimes>({
        queryKey: ["prayerTimes", region],
        queryFn: async () => {
            const { data } = await namazApi.get(`/present/day?region=${region}`);
            return data;
        },
        enabled: !!region,
    });
};
