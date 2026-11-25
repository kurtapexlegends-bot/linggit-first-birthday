import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/kingkong-auth";
import { readInvitation, storageConfigured } from "@/lib/kingkong-store";
import { readRsvps } from "@/lib/kingkong-rsvps";
import { KingkongEditor, KingkongSignIn } from "./editor";
import styles from "./editor.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Party dashboard",
  robots: { index: false, follow: false },
};

export default async function KingkongPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (!adminConfigured() || !storageConfigured()) {
    return <main className={styles.signIn}><h1>Invitation editor</h1><p>The editor is temporarily unavailable.</p></main>;
  }
  if (!(await isAdmin())) return <KingkongSignIn />;

  try {
    const [{ settings, revision, publishedAt }, entries, { view }] = await Promise.all([
      readInvitation(), readRsvps().catch(() => null), searchParams,
    ]);
    return <KingkongEditor initial={settings} initialRevision={revision} initialPublishedAt={publishedAt} initialEntries={entries} initialView={view} />;
  } catch {
    return <main className={styles.signIn}><h1>Invitation editor</h1><p>The published invitation could not be loaded. Reload to try again.</p></main>;
  }
}
