'use client';

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationItemType } from "../schemas/notification.schema";
import { useUserStore } from "../../users/stores/user.store";

type WebSocketContextType = {
    socket: Socket | null;
};

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const socketRef = useRef<Socket | null>(null);
    const user = useUserStore(s => s.user);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user) return;

        if (!socketRef.current) {
            socketRef.current = io('http://localhost:3000/socket', {
                query: { userId: user.id },
                withCredentials: true,
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                console.log('WebSocket connected', socketRef.current?.id);
            });

            socketRef.current.on('disconnect', () => {
                console.log('WebSocket disconnected');
            });

            socketRef.current.on('notification', (payload: NotificationItemType) => {
                console.log('Received notification', payload);
                queryClient.invalidateQueries({
                    queryKey: ["tasks-pending"],
                    refetchType: "active",
                });
                queryClient.invalidateQueries({
                    queryKey: ["tasks-in-progress"],
                    refetchType: "active",
                });
                queryClient.invalidateQueries({
                    queryKey: ["tasks-done"],
                    refetchType: "active",
                });
                queryClient.setQueryData(['my-notifications', { take: 20 }], (oldData: any) => {
                    if (!oldData) return { pages: [[payload]], pageParams: [] };
                    return {
                        ...oldData,
                        pages: [[payload], ...oldData.pages],
                        pageParams: oldData.pageParams,
                    };
                });
                queryClient.setQueriesData(
                    { queryKey: ['count-unread-notifications'] },
                    (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            count: Math.max(0, old.count + 1),
                        };
                    }
                )
            });
        }

        return () => {
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [user?.id, queryClient]);

    return (
        <WebSocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);