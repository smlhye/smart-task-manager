import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { userService } from "../services/user.service";

export function useMeQuery() {
    const setUser = useUserStore((s) => s.setUser);
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await userService.fetchMe();
            const data = res?.data ?? null;
            if (data) setUser(data);
            return data; 
        },
        // staleTime: 1000 * 60 * 5,
        // retry: 1,
    })
}