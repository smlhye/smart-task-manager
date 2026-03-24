export function getTimeAgo(date: Date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) return `Cập nhật ${diff} giây trước`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `Cập nhật ${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Cập nhật ${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `Cập nhật ${days} ngày trước`;

    const months = Math.floor(days / 30);
    if (months < 12) return `Cập nhật ${months} tháng trước`;

    const years = Math.floor(months / 12);
    return `Cập nhật ${years} năm trước`;
}