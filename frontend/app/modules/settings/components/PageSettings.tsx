import AppearanceSection from "./AppearanceSection";
import DangerZoneSection from "./DangerZoneSection";
import NotificationSection from "./NotificationSection";
import ProfileSection from "./ProfileSection";
import SecuritySection from "./SecuritySection";
import SettingsHeader from "./SettingHeader";

export default function PageSettings() {
    return (
        <div className="h-full overflow-y-auto scrollbar-hidden">
            <div className="max-w-4xl space-y-6 animate-fade-in">
                <SettingsHeader />
                <ProfileSection />
                <SecuritySection />
                <AppearanceSection />
                <NotificationSection />
                <DangerZoneSection />
            </div>
        </div>
    )
}