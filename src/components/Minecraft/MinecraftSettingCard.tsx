import { useQueryClient } from '@tanstack/react-query';
import { InstanceInfo } from 'bindings/InstanceInfo';
import DashboardCard from 'components/DashboardCard';
import SettingField from 'components/SettingField';
import { useInstanceManifest } from 'data/InstanceManifest';

export default function MinecraftSettingCard({
  instance,
}: {
  instance: InstanceInfo;
}) {
  const { data: manifest, isLoading } = useInstanceManifest(instance.uuid);
  const supportedOptions = manifest?.supported_operations
    ? manifest.supported_operations
    : [];
  const supportedSettings = manifest?.settings ? manifest.settings : [];
  const uuid = instance.uuid;

  // hand picked list of minecraft settings to be shown
  const settings = [
    // 'gamemode',
    // 'difficulty',
    'white-list',
    // 'online-mode',
    // 'pvp',
    'enable-command-block',
    'allow-flight',
    'spawn-animals',
    'spawn-monsters',
    'spawn-npcs',
    'allow-nether',
    'force-gamemode',
    'spawn-protection',
    'require-resource-pack',
    'resource-pack',
    'resource-pack-prompt'
  ]
  
  const availableSettings = supportedSettings.filter((setting) => settings.includes(setting));


  if (isLoading) {
    return <div>Loading...</div>;
    // TODO: show an unobtrusive loading screen, reduce UI flicker
  }

  return (
    <DashboardCard>
      <h1 className="font-bold text-medium"> Game Settings </h1>
      <div className="grid w-full grid-cols-2 gap-8 child:w-full md:grid-cols-4">
        {availableSettings.map((setting) => {
          return (
            <SettingField
              instance={instance}
              setting={setting}
              label={setting}
              key={setting}
            />
          );
        })}
      </div>
    </DashboardCard>
  );
}
