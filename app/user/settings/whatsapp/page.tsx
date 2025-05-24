import WhatsAppQR from "../../../../component/WhatsAppQR";

export default function WhatsAppPage() {
    return (
        <main className="p-8">
            <h1 className="text-xl font-bold mb-4">Koneksi WhatsApp</h1>
            <WhatsAppQR deviceId="my-device-id" />
        </main>
    );
}
