'use client';

import { redirect } from "next/navigation";
import { useAuthStore } from "./stores/auth.store";

export default function HomePage() {
    const isLoggedIn = useAuthStore((state) => !!state.accessToken);

    if (!isLoggedIn) {
        redirect("/login");
    }

    return <div>Dashboard</div>;
}