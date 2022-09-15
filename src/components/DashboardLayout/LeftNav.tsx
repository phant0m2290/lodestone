import SystemStat from './SystemStat';
import InstanceList from './InstanceList';
import { useState } from 'react';
import { useIntervalImmediate } from 'utils/hooks';
import { useCPUInfo, useOsInfo, useUptime } from 'data/SystemInfo';

// format duration in seconds to DD:HH:MM:SS
const formatDuration = (duration: number) => {
  const days = Math.floor(duration / 86400);
  const hours = Math.floor((duration % 86400) / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  return `${days < 10 ? '0' + days : days}:${
    hours < 10 ? '0' + hours : hours
  }:${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
};

export default function LeftNav() {
  const {
    data: osInfo,
    isLoading: osInfoLoading,
  } = useOsInfo();

  const {
    data: upTime,
    isLoading: upTimeLoading,
  } = useUptime();

  const {
    data: cpuInfo,
    isLoading: cpuInfoLoading,
  } = useCPUInfo();

  return (
    <div className="flex flex-col items-center px-8 pt-10 overflow-x-visible bg-gray-700 border-r border-gray-500">
      <div className="w-full max-w-xs px-6 mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="logo" className="w-full" />
        <SystemStat name="system name" value={"SYSTEM NAME TODO"} />
        <SystemStat name="cpu" value={cpuInfoLoading ? "..." : cpuInfo?.cpu_vendor} />
        <SystemStat name="os" value={osInfoLoading ? "..." : osInfo?.os_type} />
        <SystemStat name="uptime" value={upTimeLoading ? "..." : formatDuration(upTime ?? 0)} />
      </div>
      <div className="flex flex-col w-full overflow-x-visible grow">
        <h1 className="mb-4 font-bold text-center truncate text-medium">Server&nbsp;Instances</h1>
        <InstanceList />
      </div>
    </div>
  );
}
