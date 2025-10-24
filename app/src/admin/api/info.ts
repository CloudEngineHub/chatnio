import axios from "axios";
import {
  setAppLogo,
  setAppName,
  setBlobEndpoint,
  setBuyLink,
  setDocsUrl,
} from "@/conf/env.ts";
import { infoEvent } from "@/events/info.ts";
import { initGoogleAnalytics } from "@/utils/analytics.ts";
import { BroadcastEvent, getBroadcast } from "@/api/broadcast";

export type SiteInfo = {
  title: string;
  logo: string;
  docs: string;
  file: string;
  backend?: string;
  currency: string;
  announcement: string;
  buy_link: string;
  mail: boolean;
  contact: string;
  footer: string;
  auth_footer: boolean;
  hide_key_docs?: boolean;
  article: string[];
  generation: string[];
  relay_plan: boolean;
  payment: string[];
  payment_aggregation: boolean;
  ga_tracking_id?: string;
  broadcast?: BroadcastEvent;
};

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const response = await axios.get("/info");
    return response.data as SiteInfo;
  } catch (e) {
    console.warn(e);
    return {
      title: "",
      logo: "",
      docs: "",
      file: "",
      backend: undefined,
      currency: "cny",
      announcement: "",
      buy_link: "",
      contact: "",
      footer: "",
      auth_footer: false,
      hide_key_docs: false,
      mail: false,
      article: [],
      generation: [],
      relay_plan: false,
      payment: [],
      payment_aggregation: false,

      broadcast: {
        message: "",
        firstReceived: false,
      },
    };
  }
}

export function syncSiteInfo() {
  setTimeout(async () => {
    const info = await getSiteInfo();
    info.broadcast = await getBroadcast();

    setAppName(info.title);
    setAppLogo(info.logo);
    setDocsUrl(info.docs);
    setBlobEndpoint(info.file);
    setBuyLink(info.buy_link);
    initGoogleAnalytics(info.ga_tracking_id);

    infoEvent.emit(info);
  }, 25);
}
