import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchDbConfigServer, saveDbConfigServer, verifyAdminCredentials } from "../db.server";

export const getSiteConfigServerFn = createServerFn({ method: "GET" }).handler(async () => {
  const config = await fetchDbConfigServer();
  return config;
});

export const saveSiteConfigServerFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ config: z.any() }))
  .handler(async ({ data }) => {
    const success = await saveDbConfigServer(data.config);
    return { success };
  });

export const verifyAdminServerFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ username: z.string(), password: z.string() }))
  .handler(async ({ data }) => {
    const valid = await verifyAdminCredentials(data.username, data.password);
    return { valid };
  });
