import React from "react";

const DeviceDropdown = ({ devices, selectedDevice, handleDeviceChange }) => {
  const handleChange = (event) => {
    const selectedDeviceId = event.target.value;
    handleDeviceChange(selectedDeviceId);
  };

  return (
    <select value={selectedDevice} onChange={handleChange}>
      <option value="">Select Device</option>
      {devices && devices.map((device) => (
        <option key={device.id} value={device.id}>
          {device.name}
        </option>
      ))}
    </select>
  );
};

export default DeviceDropdown;