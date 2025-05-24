/* eslint-disable react-hooks/rules-of-hooks */
import makeWASocket, { useMultiFileAuthState } from "baileys";
import path from "path";
import { Boom } from "@hapi/boom";

const sessions: Record<string, ReturnType<typeof makeWASocket>> = {};

export async function getWhatsAppInstance(deviceId: string) {
    if (sessions[deviceId])  {
        return sessions[deviceId];
    }

    const {state, saveCreds} = await useMultiFileAuthState(`auth/${deviceId}`);
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);

    sessions[deviceId] = sock;

    return sock;

}