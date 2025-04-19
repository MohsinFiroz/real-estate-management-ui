import { ChatLeft, Wechat, Whatsapp } from "svelte-bootstrap-icons";

export const communicationOptions = [
    { value: "SMS", name: "SMS" },
    { value: "WeChat", name: "WeChat" },
    { value: "WhatsApp", name: "WhatsApp" },
  ];

  // Communication medium colors and costs
  export const communicationDetails = {
    "SMS": { color: "blue", icon: ChatLeft},
    "WeChat": { color: "green", icon: Wechat},
    "WhatsApp": { color: "green", icon: Whatsapp}
  } as const;

  export function getCommunicationDetails(medium: string) {
    if (!medium || !["SMS", "WeChat", "WhatsApp"].includes(medium)) return null;
    return communicationDetails[medium as keyof typeof communicationDetails];
  }