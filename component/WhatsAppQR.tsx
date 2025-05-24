"use client";

import { useEffect, useState } from "react";

type Props = {
  deviceId: string;
};

export default function WhatsAppQR({ deviceId }: Props) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/whatsapp/qr-stream?deviceId=${deviceId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.qr) setQrCode(data.qr);
      if (data.connected) {
        setConnected(true);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [deviceId]);

  return (
    <div className="flex flex-col items-center p-4 border rounded-md shadow w-fit">
      {connected ? (
        <p className="text-green-500 font-semibold">✅ Terhubung ke WhatsApp</p>
      ) : qrCode ? (
        <>
          <p className="mb-2 text-gray-700">Silakan scan QR berikut:</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCode)}&size=200x200`}
            alt="QR Code"
            className="border p-2"
          />
        </>
      ) : (
        <p className="text-gray-500">Menunggu QR code...</p>
      )}
    </div>
  );
}