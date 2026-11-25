import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/kingkong-auth";
import { readInvitation, storageConfigured } from "@/lib/kingkong-store";
import { readRsvps } from "@/lib/kingkong-rsvps";
import { KingkongEditor } from "./editor";
import { KingkongSignIn, KingkongStatusScreen } from "./sign-in";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Party dashboard",
  robots: { index: false, follow: false },
};

export default async function KingkongPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  if (!adminConfigured() || !storageConfigured()) {
    return (
      <KingkongStatusScreen
        title="Invitation editor"
        description="The editor is temporarily unavailable."
      />
    );
  }
  if (!(await isAdmin())) return <KingkongSignIn />;

  try {
    const [{ settings, revision, publishedAt }, entries, { view }] = await Promise.all([
      readInvitation(),
      readRsvps().catch(() => null),
      searchParams,
    ]);
    return (
      <KingkongEditor
        initial={settings}
        initialRevision={revision}
        initialPublishedAt={publishedAt}
        initialEntries={entries}
        initialView={view}
      />
    );
  } catch {
    return (
      <KingkongStatusScreen
        title="Invitation editor"
        description="The published invitation could not be loaded. Reload to try again."
      />
    );
  }
}
