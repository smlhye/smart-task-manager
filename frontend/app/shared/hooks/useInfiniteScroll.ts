import { RefObject, useEffect, useRef } from "react";

type UseInifiniteScrollProps = {
    hasMore?: boolean;
    loading: boolean;
    onLoadMore: () => void;
    root?: Element | null;
    threshold?: number;
}

export const useInfiniteScroll = ({
    hasMore, loading, onLoadMore, root, threshold
}: UseInifiniteScrollProps) => {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onLoadMore();
                }
            },
            {
                root,
                threshold,
            }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, onLoadMore, root, threshold]);

    return loadMoreRef;
}