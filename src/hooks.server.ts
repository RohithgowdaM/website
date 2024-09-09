import { dev } from "$app/environment";
import type { Miniflare } from "miniflare";

let mf: Miniflare;

export async function handle({ event, resolve }) {
	if (dev) {
		if (!mf) {
			const { Miniflare, Log, LogLevel } = await import("miniflare");
			mf = new Miniflare({
				log: new Log(LogLevel.INFO),
				kvPersist: "./wrangler/state/v3/kv",
				kvNamespaces: ["KV"],
				d1Persist: "./wrangler/state/v3/d1",
				d1Databases: ["D1"],
				script: "",
				modules: true,
			});
		}
		event.platform = { env: await mf.getBindings() };
	}
	return resolve(event);
}
